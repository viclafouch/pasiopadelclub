/* eslint-disable no-console */
import { serverEnv } from '@/env/server'
import { Webhooks } from '@polar-sh/tanstack-start'
import { createFileRoute } from '@tanstack/react-router'

const webhookHandler = Webhooks({
  webhookSecret: serverEnv.POLAR_WEBHOOK_SECRET,
  onOrderPaid: async (payload) => {
    const { metadata, id: polarPaymentId } = payload.data

    if (!metadata) {
      console.error('[Polar Webhook] No metadata in order')

      return
    }

    const bookingId = metadata.bookingId as string | undefined

    if (!bookingId) {
      console.error('[Polar Webhook] No bookingId in metadata')

      return
    }

    const convexUrl =
      serverEnv.VITE_CONVEX_SITE_URL ?? serverEnv.VITE_CONVEX_URL
    const confirmUrl = `${convexUrl.replace('.cloud', '.site')}/confirm-booking`

    const response = await fetch(confirmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serverEnv.WEBHOOK_AUTH_TOKEN}`
      },
      body: JSON.stringify({ bookingId, polarPaymentId })
    })

    if (!response.ok) {
      console.error(
        '[Polar Webhook] Failed to confirm booking:',
        response.status
      )

      return
    }

    console.log('[Polar Webhook] Booking confirmed:', bookingId)
  },
  onCheckoutUpdated: async (payload) => {
    console.log('[Polar Webhook] Checkout updated:', payload.data.id)
  }
})

export const Route = createFileRoute('/api/webhooks/polar')({
  server: {
    handlers: {
      POST: webhookHandler
    }
  }
})
