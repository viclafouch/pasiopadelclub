import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

export const clientEnv = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_CONVEX_URL: z.url(),
    VITE_CLERK_PUBLISHABLE_KEY: z.string(),
    VITE_SITE_URL: z.url()
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true
})
