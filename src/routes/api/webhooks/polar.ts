/* eslint-disable no-console */
import { serverEnv } from '@/env/server'
import { Webhooks } from '@polar-sh/tanstack-start'
import { createFileRoute } from '@tanstack/react-router'

const webhookHandler = Webhooks({
  webhookSecret: serverEnv.POLAR_WEBHOOK_SECRET ?? '',
  onOrderPaid: async (payload) => {
    const { metadata } = payload.data

    if (!metadata) {
      console.error('[Polar Webhook] No metadata in order')

      return
    }

    const bookingId = metadata.bookingId as string | undefined

    if (!bookingId) {
      console.error('[Polar Webhook] No bookingId in metadata')

      return
    }

    // TODO: Call Convex mutation to confirm booking
    console.log('[Polar Webhook] Order paid, bookingId:', bookingId)
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
