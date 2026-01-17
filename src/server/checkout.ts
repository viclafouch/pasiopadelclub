import { and, eq, gt, lt } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { booking, court } from '@/db/schema'
import { serverEnv } from '@/env/server'
import { formatDateFr, formatTimeFr, nowParis } from '@/helpers/date'
import { authMiddleware } from '@/lib/middleware'
import { stripe } from '@/lib/stripe.server'
import { getCourtTypeLabel } from '@/utils/court'
import { createServerFn } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'

const createCheckoutSchema = z.object({
  courtId: z.uuid(),
  startAt: z.number(),
  endAt: z.number()
})

export const createCheckoutSessionFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(createCheckoutSchema)
  .handler(async ({ data, context }) => {
    if (context.session.user.isBlocked) {
      setResponseStatus(403)
      throw new Error('Action non autorisée')
    }

    const { courtId, startAt, endAt } = data
    const startDate = new Date(startAt)
    const endDate = new Date(endAt)
    const now = nowParis()

    if (startDate <= now) {
      setResponseStatus(400)
      throw new Error('Impossible de réserver dans le passé')
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
    const expectedDurationMs = courtData.duration * 60 * 1000

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

    /* eslint-disable camelcase */
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: context.session.user.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: courtData.price,
            product_data: {
              name: `${courtData.name} - ${getCourtTypeLabel(courtData.type)}`,
              description: `${formatDateFr(startDate)} • ${formatTimeFr(startDate)} - ${formatTimeFr(endDate)} (${courtData.duration} min)`
            }
          },
          quantity: 1
        }
      ],
      metadata: {
        courtId,
        startAt: startAt.toString(),
        endAt: endAt.toString(),
        userId: context.session.user.id
      },
      success_url: `${serverEnv.VITE_SITE_URL}/reservation/success`,
      cancel_url: `${serverEnv.VITE_SITE_URL}/reservation/echec`
    })
    /* eslint-enable camelcase */

    if (!session.url) {
      setResponseStatus(500)
      throw new Error(
        'Paiement temporairement indisponible, réessayez plus tard'
      )
    }

    return { url: session.url }
  })
