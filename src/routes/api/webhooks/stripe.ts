/* eslint-disable no-console */

import { addMonths } from 'date-fns'
import { and, eq, gt, isNull, or, sum } from 'drizzle-orm'
import type Stripe from 'stripe'
import {
  bookingMetadataSchema,
  creditPackMetadataSchema
} from '@/constants/schemas'
import { STRIPE_METADATA_TYPE_CREDIT_PACK } from '@/constants/wallet'
import { db } from '@/db'
import { creditPack, user, walletTransaction } from '@/db/schema'
import { CreditPackPurchaseEmail } from '@/emails'
import { serverEnv } from '@/env/server'
import { formatDateFr, nowParis } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
import { extractFirstName } from '@/helpers/string'
import { EMAIL_FROM, getEmailRecipient, resend } from '@/lib/resend.server'
import { stripe } from '@/lib/stripe.server'
import { createBookingFromPayment } from '@/utils/booking-creation'
import { createFileRoute } from '@tanstack/react-router'

function maskId(id: string) {
  return `${id.slice(0, 8)}...`
}

async function handleCreditPackPurchase(
  session: Stripe.Checkout.Session
): Promise<void> {
  const paymentIntentId = session.payment_intent as string | null

  if (!paymentIntentId) {
    console.error('[Webhook] Missing payment_intent for credit pack')

    return
  }

  const parsed = creditPackMetadataSchema.safeParse(session.metadata)

  if (!parsed.success) {
    console.error(
      '[Webhook] Invalid credit pack metadata:',
      parsed.error.message
    )

    return
  }

  const { packId, userId, creditsCents, validityMonths } = parsed.data

  const [[userData], [packData]] = await Promise.all([
    db.select().from(user).where(eq(user.id, userId)).limit(1),
    db.select().from(creditPack).where(eq(creditPack.id, packId)).limit(1)
  ])

  if (!userData) {
    console.error('[Webhook] User not found for credit pack:', maskId(userId))

    return
  }

  if (!packData) {
    console.error('[Webhook] Credit pack not found:', maskId(packId))

    return
  }

  const expiresAt = addMonths(nowParis(), validityMonths)

  const insertedRows = await db.transaction(
    async (tx) => {
      const txNow = nowParis()
      const [balanceResult] = await tx
        .select({ balance: sum(walletTransaction.amountCents) })
        .from(walletTransaction)
        .where(
          and(
            eq(walletTransaction.userId, userId),
            or(
              isNull(walletTransaction.expiresAt),
              gt(walletTransaction.expiresAt, txNow)
            )
          )
        )

      const currentBalance = Number(balanceResult?.balance ?? 0)
      const newBalance = currentBalance + creditsCents

      return tx
        .insert(walletTransaction)
        .values({
          userId,
          type: 'purchase',
          amountCents: creditsCents,
          balanceAfterCents: newBalance,
          creditPackId: packId,
          stripePaymentId: paymentIntentId,
          expiresAt,
          description: `Achat pack ${packData.name}`
        })
        .onConflictDoNothing({ target: walletTransaction.stripePaymentId })
        .returning({ id: walletTransaction.id })
    },
    { isolationLevel: 'serializable' }
  )

  if (insertedRows.length === 0) {
    console.log(
      '[Webhook] Credit pack already processed:',
      maskId(paymentIntentId)
    )

    return
  }

  console.log('[Webhook] Credit pack purchased:', {
    userId: maskId(userId),
    credits: creditsCents / 100,
    expiresAt: expiresAt.toISOString()
  })

  const emailTo = getEmailRecipient(userData.email)
  console.log('[Webhook] Sending credit pack email to:', emailTo)

  resend.emails
    .send({
      from: EMAIL_FROM,
      to: emailTo,
      subject: `Achat confirmé - ${packData.name}`,
      react: CreditPackPurchaseEmail({
        firstName: userData.firstName ?? extractFirstName(userData.name),
        packName: packData.name,
        creditsAmount: formatCentsToEuros(creditsCents),
        totalPaid: formatCentsToEuros(packData.priceCents),
        expiresAt: formatDateFr(expiresAt),
        baseUrl: serverEnv.VITE_SITE_URL
      })
    })
    .then(() => {
      console.log('[Webhook] Credit pack email sent successfully')
    })
    .catch((error) => {
      console.error('[Webhook] Failed to send credit pack email:', error)
    })
}

type HandleBookingPaymentParams = {
  paymentIntentId: string
  amountPaid: number
  metadata: unknown
  source: 'payment_intent' | 'checkout'
}

async function handleBookingPayment({
  paymentIntentId,
  amountPaid,
  metadata,
  source
}: HandleBookingPaymentParams): Promise<void> {
  const parsed = bookingMetadataSchema.safeParse(metadata)

  if (!parsed.success) {
    const message =
      source === 'payment_intent'
        ? '[Webhook] PaymentIntent without booking metadata, skipping'
        : `[Webhook] Invalid booking metadata: ${parsed.error.message}`
    console.log(message)

    return
  }

  const { courtId, userId, startAt, endAt } = parsed.data

  const result = await createBookingFromPayment({
    paymentIntentId,
    amountPaid,
    courtId,
    userId,
    startAt,
    endAt
  })

  if (result.success) {
    console.log('[Webhook] Booking processed:', maskId(result.bookingId))
  } else {
    console.log(
      '[Webhook] Booking failed, refunded:',
      maskId(paymentIntentId),
      result.reason
    )
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  await handleBookingPayment({
    paymentIntentId: paymentIntent.id,
    amountPaid: paymentIntent.amount,
    metadata: paymentIntent.metadata,
    source: 'payment_intent'
  })
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const paymentIntentId = session.payment_intent as string | null

  if (!paymentIntentId) {
    console.error('[Webhook] Missing payment_intent')

    return
  }

  const amountPaid = session.amount_total

  if (!amountPaid) {
    console.error('[Webhook] Missing amount_total')

    return
  }

  await handleBookingPayment({
    paymentIntentId,
    amountPaid,
    metadata: session.metadata,
    source: 'checkout'
  })
}

async function webhookHandler({
  request
}: {
  request: Request
}): Promise<Response> {
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Invalid request', { status: 400 })
  }

  const rawBody = await request.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      serverEnv.STRIPE_WEBHOOK_SECRET
    )
  } catch {
    console.error('[Webhook] Verification failed')

    return new Response('Invalid request', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const matchIsCreditPack =
          session.metadata?.type === STRIPE_METADATA_TYPE_CREDIT_PACK

        if (matchIsCreditPack) {
          await handleCreditPackPurchase(session)
        } else {
          await handleCheckoutCompleted(session)
        }

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentSucceeded(paymentIntent)

        break
      }

      default:
        console.log('[Webhook] Unhandled event type:', event.type)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('[Webhook] Handler failed:', error)

    return new Response('Processing failed', { status: 500 })
  }
}

export const Route = createFileRoute('/api/webhooks/stripe')({
  server: {
    handlers: {
      POST: webhookHandler
    }
  }
})
