import { and, eq, gt, lt } from 'drizzle-orm'
import { db } from '@/db'
import { booking, court, user } from '@/db/schema'
import { BookingConfirmationEmail } from '@/emails'
import { serverEnv } from '@/env/server'
import { formatDateFr, formatTimeFr } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
import { extractFirstName } from '@/helpers/string'
import { EMAIL_FROM, getEmailRecipient, resend } from '@/lib/resend.server'
import { safeRefund } from '@/utils/stripe'
import { createServerOnlyFn } from '@tanstack/react-start'

type CreateBookingParams = {
  paymentIntentId: string
  amountPaid: number
  courtId: string
  userId: string
  startAt: Date
  endAt: Date
}

type CreateBookingResult =
  | { success: true; bookingId: string }
  | { success: false; reason: 'slot_conflict' | 'refunded' }

export const createBookingFromPayment = createServerOnlyFn(
  async (params: CreateBookingParams) => {
    const { paymentIntentId, amountPaid, courtId, userId, startAt, endAt } =
      params

    const result = await db.transaction(
      async (tx) => {
        const [existingPaymentBooking] = await tx
          .select({ id: booking.id })
          .from(booking)
          .where(eq(booking.stripePaymentId, paymentIntentId))
          .limit(1)

        if (existingPaymentBooking) {
          return {
            success: true as const,
            bookingId: existingPaymentBooking.id,
            alreadyProcessed: true
          }
        }

        const [[userData], [courtData]] = await Promise.all([
          tx.select().from(user).where(eq(user.id, userId)).limit(1),
          tx.select().from(court).where(eq(court.id, courtId)).limit(1)
        ])

        if (!userData || !courtData) {
          return { success: false as const, reason: 'refunded' as const }
        }

        if (amountPaid !== courtData.price) {
          return { success: false as const, reason: 'refunded' as const }
        }

        const [existingSlotBooking] = await tx
          .select({ id: booking.id })
          .from(booking)
          .where(
            and(
              eq(booking.courtId, courtId),
              eq(booking.status, 'confirmed'),
              lt(booking.startAt, endAt),
              gt(booking.endAt, startAt)
            )
          )
          .limit(1)

        if (existingSlotBooking) {
          return { success: false as const, reason: 'slot_conflict' as const }
        }

        const [createdBooking] = await tx
          .insert(booking)
          .values({
            userId,
            courtId,
            startAt,
            endAt,
            price: courtData.price,
            paymentType: 'online',
            status: 'confirmed',
            stripePaymentId: paymentIntentId
          })
          .returning({ id: booking.id })

        if (!createdBooking) {
          throw new Error('Failed to create booking')
        }

        return {
          success: true as const,
          bookingId: createdBooking.id,
          userData,
          courtData
        }
      },
      { isolationLevel: 'serializable' }
    )

    if (!result.success) {
      await safeRefund({
        paymentIntentId,
        reason: result.reason === 'slot_conflict' ? 'duplicate' : 'fraudulent'
      })

      return {
        success: false,
        reason: result.reason
      } satisfies CreateBookingResult
    }

    if ('alreadyProcessed' in result) {
      return {
        success: true,
        bookingId: result.bookingId
      } satisfies CreateBookingResult
    }

    const { bookingId, userData, courtData } = result

    resend.emails
      .send({
        from: EMAIL_FROM,
        to: getEmailRecipient(userData.email),
        subject: `Réservation confirmée - ${courtData.name} le ${formatDateFr(startAt)}`,
        react: BookingConfirmationEmail({
          firstName: userData.firstName ?? extractFirstName(userData.name),
          courtName: courtData.name,
          date: formatDateFr(startAt),
          startTime: formatTimeFr(startAt),
          endTime: formatTimeFr(endAt),
          price: formatCentsToEuros(courtData.price),
          baseUrl: serverEnv.VITE_SITE_URL
        })
      })
      .catch(console.error)

    return { success: true, bookingId } satisfies CreateBookingResult
  }
)
