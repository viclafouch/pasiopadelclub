import { and, count, desc, eq, gt, lte, or, sum } from 'drizzle-orm'
import { cancelBookingSchema } from '@/constants/schemas'
import { db } from '@/db'
import { booking, court, walletTransaction } from '@/db/schema'
import { BookingCancellationEmail } from '@/emails'
import { formatDateFr, formatTimeFr, nowParis } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
import { extractFirstName } from '@/helpers/string'
import { activeUserMiddleware, authMiddleware } from '@/lib/middleware'
import { EMAIL_FROM, getEmailRecipient, resend } from '@/lib/resend.server'
import { matchCanCancelBooking } from '@/utils/booking'
import { safeRefund } from '@/utils/stripe'
import { createServerFn } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'

export const getActiveBookingCountFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const [result] = await db
      .select({ count: count() })
      .from(booking)
      .where(
        and(
          eq(booking.userId, context.session.user.id),
          gt(booking.endAt, nowParis()),
          eq(booking.status, 'confirmed')
        )
      )

    return result?.count ?? 0
  })

export const getUpcomingBookingsFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const bookings = await db
      .select()
      .from(booking)
      .innerJoin(court, eq(booking.courtId, court.id))
      .where(
        and(
          eq(booking.userId, context.session.user.id),
          gt(booking.endAt, nowParis()),
          eq(booking.status, 'confirmed')
        )
      )
      .orderBy(booking.startAt)

    return bookings.map((row) => {
      return {
        ...row.booking,
        court: row.court
      }
    })
  })

export const getBookingHistoryFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const bookings = await db
      .select()
      .from(booking)
      .innerJoin(court, eq(booking.courtId, court.id))
      .where(
        and(
          eq(booking.userId, context.session.user.id),
          or(lte(booking.endAt, nowParis()), eq(booking.status, 'cancelled'))
        )
      )
      .orderBy(desc(booking.startAt))
      .limit(50)

    return bookings.map((row) => {
      return {
        ...row.booking,
        court: row.court
      }
    })
  })

export const getLatestBookingFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const [result] = await db
      .select()
      .from(booking)
      .innerJoin(court, eq(booking.courtId, court.id))
      .where(
        and(
          eq(booking.userId, context.session.user.id),
          eq(booking.status, 'confirmed')
        )
      )
      .orderBy(desc(booking.createdAt))
      .limit(1)

    if (!result) {
      return null
    }

    return {
      ...result.booking,
      court: result.court
    }
  })

export const cancelBookingFn = createServerFn({ method: 'POST' })
  .middleware([activeUserMiddleware])
  .inputValidator(cancelBookingSchema)
  .handler(async ({ data, context }) => {
    const { bookingId } = data
    const userId = context.session.user.id
    const userEmail = context.session.user.email
    const userFirstName =
      context.session.user.firstName ??
      extractFirstName(context.session.user.name)

    const [bookingWithCourt] = await db
      .select()
      .from(booking)
      .innerJoin(court, eq(booking.courtId, court.id))
      .where(and(eq(booking.id, bookingId), eq(booking.userId, userId)))
      .limit(1)

    if (!bookingWithCourt) {
      setResponseStatus(403)
      throw new Error('Action non autorisée')
    }

    const bookingData = bookingWithCourt.booking
    const courtData = bookingWithCourt.court

    if (bookingData.status === 'cancelled') {
      setResponseStatus(400)
      throw new Error('Réservation déjà annulée')
    }

    if (bookingData.status !== 'confirmed') {
      setResponseStatus(400)
      throw new Error("Impossible d'annuler cette réservation")
    }

    if (!matchCanCancelBooking(bookingData.startAt)) {
      setResponseStatus(400)
      throw new Error('Annulation impossible moins de 24h avant')
    }

    const updatedRows = await db
      .update(booking)
      .set({ status: 'cancelled' })
      .where(and(eq(booking.id, bookingId), eq(booking.status, 'confirmed')))
      .returning({ id: booking.id })

    if (updatedRows.length === 0) {
      setResponseStatus(409)
      throw new Error('Réservation déjà annulée')
    }

    if (bookingData.paymentType === 'credit') {
      await db.transaction(
        async (tx) => {
          const [balanceResult] = await tx
            .select({ balance: sum(walletTransaction.amountCents) })
            .from(walletTransaction)
            .where(eq(walletTransaction.userId, userId))

          const currentBalance = Number(balanceResult?.balance ?? 0)
          const newBalance = currentBalance + bookingData.price

          await tx.insert(walletTransaction).values({
            userId,
            type: 'refund',
            amountCents: bookingData.price,
            balanceAfterCents: newBalance,
            bookingId,
            description: 'Remboursement annulation'
          })
        },
        { isolationLevel: 'serializable' }
      )
    } else if (bookingData.stripePaymentId) {
      const refundResult = await safeRefund({
        paymentIntentId: bookingData.stripePaymentId
      })

      if (!refundResult.success && !refundResult.alreadyRefunded) {
        setResponseStatus(503)
        throw new Error(
          'Remboursement temporairement indisponible, réessayez plus tard'
        )
      }
    }

    resend.emails
      .send({
        from: EMAIL_FROM,
        to: getEmailRecipient(userEmail),
        subject: `Annulation confirmée - ${courtData.name} le ${formatDateFr(bookingData.startAt)}`,
        react: BookingCancellationEmail({
          firstName: userFirstName,
          courtName: courtData.name,
          date: formatDateFr(bookingData.startAt),
          startTime: formatTimeFr(bookingData.startAt),
          price: formatCentsToEuros(bookingData.price)
        })
      })
      // eslint-disable-next-line no-console
      .catch(console.error)

    return { success: true }
  })
