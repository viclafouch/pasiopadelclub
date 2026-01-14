import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

export const serverEnv = createEnv({
  server: {
    VITE_CONVEX_URL: z.url(),
    VITE_CONVEX_SITE_URL: z.url().optional(),
    VITE_SITE_URL: z.url(),
    POLAR_ACCESS_TOKEN: z.string().startsWith('polar_'),
    POLAR_WEBHOOK_SECRET: z.string().min(1),
    WEBHOOK_AUTH_TOKEN: z.string().min(32)
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
})
