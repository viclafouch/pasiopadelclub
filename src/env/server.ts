import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    VITE_SITE_URL: z.url(),
    POLAR_ACCESS_TOKEN: z.string().startsWith('polar_'),
    POLAR_WEBHOOK_SECRET: z.string().nonempty()
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
})
