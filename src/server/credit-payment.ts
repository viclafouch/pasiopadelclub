import { addDays } from 'date-fns'
import { and, eq, gt, isNull, lt, or, sum } from 'drizzle-orm'
import { DAYS_TO_SHOW, MS_PER_MINUTE } from '@/constants/booking'
import { bookingSlotSchema } from '@/constants/schemas'
import { db } from '@/db'
import { booking, court, walletTransaction } from '@/db/schema'
import { nowParis } from '@/helpers/date'
import { verifiedEmailMiddleware } from '@/lib/middleware'
import { createServerFn } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'

export const payBookingWithCreditsFn = createServerFn({ method: 'POST' })
  .middleware([verifiedEmailMiddleware])
  .inputValidator(bookingSlotSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id
    const { courtId, startAt, endAt } = data
    const startDate = new Date(startAt)
    const endDate = new Date(endAt)
    const now = nowParis()

    if (startDate <= now) {
      setResponseStatus(400)
      throw new Error('Impossible de réserver dans le passé')
    }

    const maxAdvanceDate = addDays(now, DAYS_TO_SHOW)

    if (startDate > maxAdvanceDate) {
      setResponseStatus(400)
      throw new Error(
        `Impossible de réserver plus de ${DAYS_TO_SHOW} jours à l'avance`
      )
    }

    if (endDate <= startDate) {
      setResponseStatus(400)
      throw new Error('Horaire invalide')
    }

    const result = await db.transaction(
      async (tx) => {
        const [courtData] = await tx
          .select()
          .from(court)
          .where(eq(court.id, courtId))
          .limit(1)

        if (!courtData) {
          throw new Error('Terrain introuvable')
        }

        const durationMs = endAt - startAt
        const expectedDurationMs = courtData.duration * MS_PER_MINUTE

        if (durationMs !== expectedDurationMs) {
          throw new Error('Durée de réservation invalide')
        }

        const [existingBooking] = await tx
          .select({ id: booking.id })
          .from(booking)
          .where(
            and(
              eq(booking.courtId, courtId),
              eq(booking.status, 'confirmed'),
              lt(booking.startAt, endDate),
              gt(booking.endAt, startDate)
            )
          )
          .limit(1)

        if (existingBooking) {
          throw new Error('Créneau déjà réservé')
        }

        const [balanceResult] = await tx
          .select({ balance: sum(walletTransaction.amountCents) })
          .from(walletTransaction)
          .where(
            and(
              eq(walletTransaction.userId, userId),
              or(
                isNull(walletTransaction.expiresAt),
                gt(walletTransaction.expiresAt, now)
              )
            )
          )

        const currentBalance = Number(balanceResult?.balance ?? 0)

        if (currentBalance < courtData.price) {
          throw new Error('Solde de crédits insuffisant')
        }

        const newBalance = currentBalance - courtData.price

        const [transaction] = await tx
          .insert(walletTransaction)
          .values({
            userId,
            type: 'payment',
            amountCents: -courtData.price,
            balanceAfterCents: newBalance,
            description: `Réservation ${courtData.name}`
          })
          .returning()

        if (!transaction) {
          throw new Error('Erreur lors du paiement')
        }

        const [newBooking] = await tx
          .insert(booking)
          .values({
            userId,
            courtId,
            startAt: startDate,
            endAt: endDate,
            price: courtData.price,
            paymentType: 'credit',
            status: 'confirmed',
            creditTransactionId: transaction.id
          })
          .returning()

        if (!newBooking) {
          throw new Error('Erreur lors de la réservation')
        }

        await tx
          .update(walletTransaction)
          .set({ bookingId: newBooking.id })
          .where(eq(walletTransaction.id, transaction.id))

        return { bookingId: newBooking.id }
      },
      { isolationLevel: 'serializable' }
    )

    return result
  })
