import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

export const serverEnv = createEnv({
  server: {
    VITE_CONVEX_URL: z.url(),
    VITE_CONVEX_SITE_URL: z.url().optional()
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
})
