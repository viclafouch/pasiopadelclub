import { z } from 'zod'

const envSchema = z.object({
  AUTH_RESEND_KEY: z.string().optional()
})

export const convexEnv = {
  ...envSchema.parse({
    AUTH_RESEND_KEY: process.env.AUTH_RESEND_KEY
  }),
  CONVEX_SITE_URL: process.env.CONVEX_SITE_URL as string
}
