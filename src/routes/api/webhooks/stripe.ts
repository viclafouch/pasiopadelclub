/* eslint-disable no-console */
/* eslint-disable camelcase */
import { and, eq, gt, lt } from 'drizzle-orm'
import type Stripe from 'stripe'
import { db } from '@/db'
import { booking, court, user } from '@/db/schema'
import { serverEnv } from '@/env/server'
import { stripe } from '@/lib/stripe.server'
import { createFileRoute } from '@tanstack/react-router'

const processedEventIds = new Set<string>()

const maskEmail = (email: string) => {
  const [local, domain] = email.split('@')

  return `${local?.[0] ?? '?'}***@${domain}`
}

const maskId = (id: string) => {
  return `${id.slice(0, 8)}...`
}

const handleCheckoutCompleted = async (
  eventId: string,
  session: Stripe.Checkout.Session
): Promise<void> => {
  if (processedEventIds.has(eventId)) {
    console.log('[Webhook] Event already processed:', eventId)

    return
  }

  const {
    metadata,
    customer_email: customerEmail,
    amount_total: amountPaid
  } = session
  const paymentIntentId = session.payment_intent as string | null

  if (!paymentIntentId) {
    console.error('[Webhook] Missing payment_intent')

    return
  }

  if (!metadata?.courtId || !metadata.startAt || !metadata.endAt) {
    console.error('[Webhook] Missing metadata')

    return
  }

  if (!metadata.userId) {
    console.error('[Webhook] Missing userId in metadata')

    return
  }

  const { courtId } = metadata
  const startAt = Number(metadata.startAt)
  const endAt = Number(metadata.endAt)
  const { userId } = metadata

  const startDate = new Date(startAt)
  const endDate = new Date(endAt)

  const [existingPayment] = await db
    .select({ id: booking.id })
    .from(booking)
    .where(eq(booking.stripePaymentId, paymentIntentId))
    .limit(1)

  if (existingPayment) {
    console.log('[Webhook] Payment already processed:', maskId(paymentIntentId))
    processedEventIds.add(eventId)

    return
  }

  const [[userData], [courtData]] = await Promise.all([
    db.select().from(user).where(eq(user.id, userId)).limit(1),
    db.select().from(court).where(eq(court.id, courtId)).limit(1)
  ])

  if (!userData) {
    console.error(
      '[Webhook] User not found:',
      customerEmail ? maskEmail(customerEmail) : 'unknown'
    )

    return
  }

  if (!courtData) {
    console.error('[Webhook] Court not found:', maskId(courtId))

    return
  }

  if (!amountPaid || amountPaid !== courtData.price) {
    console.error('[Webhook] Price mismatch:', {
      expected: courtData.price,
      paid: amountPaid
    })
    await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: 'fraudulent'
    })

    return
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
    console.error('[Webhook] Slot conflict - auto refund:', {
      courtId: maskId(courtId),
      paymentId: maskId(paymentIntentId)
    })
    await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: 'duplicate'
    })

    return
  }

  try {
    const [newBooking] = await db
      .insert(booking)
      .values({
        userId: userData.id,
        courtId,
        startAt: startDate,
        endAt: endDate,
        price: courtData.price,
        paymentType: 'online',
        status: 'confirmed',
        stripePaymentId: paymentIntentId
      })
      .returning()

    console.log('[Webhook] Booking created:', maskId(newBooking?.id ?? ''))
    processedEventIds.add(eventId)
  } catch (error) {
    const isUniqueViolation =
      error instanceof Error && error.message.includes('unique')

    if (isUniqueViolation) {
      console.log(
        '[Webhook] Duplicate payment ignored:',
        maskId(paymentIntentId)
      )
      processedEventIds.add(eventId)

      return
    }

    throw error
  }
}

const webhookHandler = async ({
  request
}: {
  request: Request
}): Promise<Response> => {
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

  if (processedEventIds.has(event.id)) {
    console.log('[Webhook] Duplicate event ignored:', event.id)

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(event.id, session)
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
