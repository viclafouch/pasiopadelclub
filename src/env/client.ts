import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

export const clientEnv = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_SITE_URL: z.url()
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true
})
