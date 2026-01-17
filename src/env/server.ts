import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    VITE_SITE_URL: z.url(),
    STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
    STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_')
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
})
