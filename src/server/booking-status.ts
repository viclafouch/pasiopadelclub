import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { booking } from '@/db/schema'
import { activeUserMiddleware } from '@/lib/middleware'
import { createServerFn } from '@tanstack/react-start'

const bookingStatusSchema = z.object({
  paymentIntentId: z.string().min(1)
})

export const getBookingByPaymentIntentFn = createServerFn({ method: 'GET' })
  .middleware([activeUserMiddleware])
  .inputValidator(bookingStatusSchema)
  .handler(async ({ data, context }) => {
    const { paymentIntentId } = data
    const userId = context.session.user.id

    const [existingBooking] = await db
      .select({ id: booking.id, ownerId: booking.userId })
      .from(booking)
      .where(eq(booking.stripePaymentId, paymentIntentId))
      .limit(1)

    if (!existingBooking || existingBooking.ownerId !== userId) {
      return { found: false as const }
    }

    return { found: true as const, bookingId: existingBooking.id }
  })
