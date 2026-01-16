import { and, count, desc, eq, gt, lte } from 'drizzle-orm'
import { cancelBookingSchema } from '@/constants/schemas'
import { db } from '@/db'
import { booking, court } from '@/db/schema'
import { nowParis } from '@/helpers/date'
import { polar } from '@/lib/auth'
import { authMiddleware } from '@/lib/middleware'
import { matchCanCancelBooking } from '@/utils/booking'
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
          lte(booking.endAt, nowParis())
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
  .middleware([authMiddleware])
  .inputValidator(cancelBookingSchema)
  .handler(async ({ data, context }) => {
    if (context.session.user.isBlocked) {
      setResponseStatus(403)
      throw new Error('Action non autorisée')
    }

    const { bookingId } = data

    const [bookingData] = await db
      .select()
      .from(booking)
      .where(
        and(
          eq(booking.id, bookingId),
          eq(booking.userId, context.session.user.id)
        )
      )
      .limit(1)

    if (!bookingData) {
      setResponseStatus(403)
      throw new Error('Action non autorisée')
    }

    if (!matchCanCancelBooking(bookingData.startAt)) {
      setResponseStatus(400)
      throw new Error('Annulation impossible moins de 24h avant')
    }

    if (bookingData.polarPaymentId) {
      try {
        await polar.refunds.create({
          orderId: bookingData.polarPaymentId,
          reason: 'customer_request',
          amount: bookingData.price
        })
      } catch {
        setResponseStatus(503)
        throw new Error(
          'Remboursement temporairement indisponible, réessayez plus tard'
        )
      }
    }

    await db
      .update(booking)
      .set({ status: 'cancelled' })
      .where(eq(booking.id, bookingId))

    return { success: true }
  })
