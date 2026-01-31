import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

export const serverEnv = createEnv({
  server: {
    VITE_SITE_URL: z.url()
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
})
