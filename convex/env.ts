import { z } from 'zod'

const envSchema = z.object({
  SITE_URL: z.url()
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid Convex environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid Convex environment variables')
}

export const convexEnv = parsed.data
