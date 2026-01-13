import { serverEnv } from '@/env/server'
import { Polar } from '@polar-sh/sdk'

export const polar = new Polar({
  accessToken: serverEnv.POLAR_ACCESS_TOKEN,
  server: 'sandbox'
})
