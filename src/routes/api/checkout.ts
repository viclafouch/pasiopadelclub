import { serverEnv } from '@/env/server'
import { Checkout } from '@polar-sh/tanstack-start'
import { createFileRoute } from '@tanstack/react-router'

const checkoutHandler = Checkout({
  accessToken: serverEnv.POLAR_ACCESS_TOKEN,
  successUrl: '/reservation/success?checkout_id={CHECKOUT_ID}',
  server: 'sandbox'
})

export const Route = createFileRoute('/api/checkout')({
  server: {
    handlers: {
      GET: checkoutHandler,
      POST: checkoutHandler
    }
  }
})
