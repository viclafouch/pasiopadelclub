/* eslint-disable no-console */

import { addMonths } from 'date-fns'
import { and, eq, gt, isNull, lt, or, sum } from 'drizzle-orm'
import type Stripe from 'stripe'
import {
  bookingMetadataSchema,
  creditPackMetadataSchema
} from '@/constants/schemas'
import { STRIPE_METADATA_TYPE_CREDIT_PACK } from '@/constants/wallet'
import { db } from '@/db'
import {
  booking,
  court,
  creditPack,
  user,
  walletTransaction
} from '@/db/schema'
import { BookingConfirmationEmail, CreditPackPurchaseEmail } from '@/emails'
import { serverEnv } from '@/env/server'
import { formatDateFr, formatTimeFr, nowParis } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
import { extractFirstName } from '@/helpers/string'
import { EMAIL_FROM, getEmailRecipient, resend } from '@/lib/resend.server'
import { stripe } from '@/lib/stripe.server'
import { safeRefund } from '@/utils/stripe'
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
        expiresAt: formatDateFr(expiresAt)
      })
    })
    .then(() => {
      console.log('[Webhook] Credit pack email sent successfully')
    })
    .catch((error) => {
      console.error('[Webhook] Failed to send credit pack email:', error)
    })
}

type CreateBookingFromPaymentParams = {
  paymentIntentId: string
  amountPaid: number
  metadata: unknown
  source: 'payment_intent' | 'checkout'
}

async function createBookingFromPayment({
  paymentIntentId,
  amountPaid,
  metadata,
  source
}: CreateBookingFromPaymentParams): Promise<void> {
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

  const [[userData], [courtData]] = await Promise.all([
    db.select().from(user).where(eq(user.id, userId)).limit(1),
    db.select().from(court).where(eq(court.id, courtId)).limit(1)
  ])

  if (!userData) {
    console.error('[Webhook] User not found:', maskId(userId))

    return
  }

  if (!courtData) {
    console.error('[Webhook] Court not found:', maskId(courtId))

    return
  }

  if (amountPaid !== courtData.price) {
    console.error('[Webhook] Price mismatch:', {
      expected: courtData.price,
      paid: amountPaid
    })
    await safeRefund({ paymentIntentId, reason: 'fraudulent' })

    return
  }

  const [existingBooking] = await db
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

  if (existingBooking) {
    console.error('[Webhook] Slot conflict - auto refund:', {
      courtId: maskId(courtId),
      paymentId: maskId(paymentIntentId)
    })
    await safeRefund({ paymentIntentId, reason: 'duplicate' })

    return
  }

  const insertedRows = await db
    .insert(booking)
    .values({
      userId: userData.id,
      courtId,
      startAt,
      endAt,
      price: courtData.price,
      paymentType: 'online',
      status: 'confirmed',
      stripePaymentId: paymentIntentId
    })
    .onConflictDoNothing({ target: booking.stripePaymentId })
    .returning({ id: booking.id })

  if (insertedRows.length === 0) {
    console.log('[Webhook] Payment already processed:', maskId(paymentIntentId))

    return
  }

  console.log('[Webhook] Booking created:', maskId(insertedRows[0]?.id ?? ''))

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
        price: formatCentsToEuros(courtData.price)
      })
    })
    .catch(console.error)
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  await createBookingFromPayment({
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

  await createBookingFromPayment({
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
