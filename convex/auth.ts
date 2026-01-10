import { createClient } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { betterAuth } from 'better-auth/minimal'
import type { GenericCtx } from '@convex-dev/better-auth'
import type { DataModel } from './_generated/dataModel'
import { components } from './_generated/api'
import authConfig from './auth.config'

const siteUrl = process.env.SITE_URL

export const authComponent = createClient<DataModel>(components.betterAuth)

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      // Keep this to false for now, we'll enable it later
      requireEmailVerification: false
    },
    user: {
      additionalFields: {
        firstName: {
          type: 'string',
          required: true
        },
        lastName: {
          type: 'string',
          required: true
        },
        phone: {
          type: 'string',
          required: true
        }
      }
    },
    plugins: [convex({ authConfig })]
  })
}
