import { clientEnv } from '@/env/client'
import { loadStripe } from '@stripe/stripe-js'

export const stripePromise = loadStripe(clientEnv.VITE_STRIPE_PUBLISHABLE_KEY)
