// See .env.example for documentation on each variable
import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    VITE_SITE_URL: z.url(),
    STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
    STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
    RESEND_API_KEY: z.string().startsWith('re_'),
    EMAIL_OVERRIDE_TO: z.email().optional(),
    EMAIL_OVERRIDE_FROM: z.string().optional(),
    SKIP_EMAIL_VERIFICATION: z
      .enum(['true', 'false'])
      .default('false')
      .transform((value) => {
        return value === 'true'
      })
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
})
