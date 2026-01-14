import { serverEnv } from '@/env/server'
import { Checkout } from '@polar-sh/tanstack-start'
import { createFileRoute } from '@tanstack/react-router'

const checkoutHandler = Checkout({
  accessToken: serverEnv.POLAR_ACCESS_TOKEN,
  successUrl: `${serverEnv.VITE_SITE_URL}/reservation/success`,
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
