import { addDays } from 'date-fns'
import { and, eq, gt, lt } from 'drizzle-orm'
import { DAYS_TO_SHOW, MS_PER_MINUTE } from '@/constants/booking'
import { bookingSlotSchema } from '@/constants/schemas'
import { db } from '@/db'
import { booking, court } from '@/db/schema'
import { formatDateFr, formatTimeFr, nowParis } from '@/helpers/date'
import { activeUserMiddleware } from '@/lib/middleware'
import { stripe } from '@/lib/stripe.server'
import { getCourtTypeLabel } from '@/utils/court'
import { createServerFn } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'

export const createPaymentIntentFn = createServerFn({ method: 'POST' })
  .middleware([activeUserMiddleware])
  .inputValidator(bookingSlotSchema)
  .handler(async ({ data, context }) => {
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

    const [courtData] = await db
      .select()
      .from(court)
      .where(eq(court.id, courtId))
      .limit(1)

    if (!courtData) {
      setResponseStatus(404)
      throw new Error('Terrain introuvable')
    }

    const durationMs = endAt - startAt
    const expectedDurationMs = courtData.duration * MS_PER_MINUTE

    if (durationMs !== expectedDurationMs) {
      setResponseStatus(400)
      throw new Error('Durée de réservation invalide')
    }

    const [existingBooking] = await db
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
      setResponseStatus(409)
      throw new Error('Créneau déjà réservé')
    }

    const description = `${courtData.name} - ${getCourtTypeLabel(courtData.type)} • ${formatDateFr(startDate)} • ${formatTimeFr(startDate)} - ${formatTimeFr(endDate)}`

    /* eslint-disable camelcase */
    const paymentIntent = await stripe.paymentIntents.create({
      amount: courtData.price,
      currency: 'eur',
      payment_method_types: ['card'],
      receipt_email: context.session.user.email,
      description,
      metadata: {
        courtId,
        startAt: startAt.toString(),
        endAt: endAt.toString(),
        userId: context.session.user.id
      }
    })
    /* eslint-enable camelcase */

    if (!paymentIntent.client_secret) {
      setResponseStatus(500)
      throw new Error(
        'Paiement temporairement indisponible, réessayez plus tard'
      )
    }

    return { clientSecret: paymentIntent.client_secret }
  })
