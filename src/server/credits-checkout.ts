import { eq } from 'drizzle-orm'
import { creditPackIdSchema } from '@/constants/schemas'
import { STRIPE_METADATA_TYPE_CREDIT_PACK } from '@/constants/wallet'
import { db } from '@/db'
import { creditPack } from '@/db/schema'
import { serverEnv } from '@/env/server'
import { verifiedEmailMiddleware } from '@/lib/middleware'
import { stripe } from '@/lib/stripe.server'
import { createServerFn } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'

export const createCreditPackCheckoutFn = createServerFn({ method: 'POST' })
  .middleware([verifiedEmailMiddleware])
  .inputValidator(creditPackIdSchema)
  .handler(async ({ data, context }) => {
    const [pack] = await db
      .select()
      .from(creditPack)
      .where(eq(creditPack.id, data.packId))
      .limit(1)

    if (!pack || !pack.isActive) {
      setResponseStatus(404)
      throw new Error('Pack introuvable')
    }

    const bonusCents = pack.creditsCents - pack.priceCents

    /* eslint-disable camelcase */
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: context.session.user.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: pack.priceCents,
            product_data: {
              name: `Pack ${pack.name}`,
              description: `${(pack.creditsCents / 100).toFixed(0)}€ de crédits${bonusCents > 0 ? ` (dont ${(bonusCents / 100).toFixed(0)}€ offerts)` : ''}`
            }
          },
          quantity: 1
        }
      ],
      metadata: {
        type: STRIPE_METADATA_TYPE_CREDIT_PACK,
        packId: pack.id,
        userId: context.session.user.id,
        creditsCents: pack.creditsCents.toString(),
        validityMonths: pack.validityMonths.toString()
      },
      success_url: `${serverEnv.VITE_SITE_URL}/credits?success=true`,
      cancel_url: `${serverEnv.VITE_SITE_URL}/credits?cancelled=true`
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
