import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { POLAR_PRODUCT_IDS } from '@/constants/polar'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { serverEnv } from '@/env/server'
import { checkout, polar as polarPlugin, webhooks } from '@polar-sh/better-auth'
import { Polar } from '@polar-sh/sdk'

export const polar = new Polar({
  accessToken: serverEnv.POLAR_ACCESS_TOKEN,
  server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
})

export const auth = betterAuth({
  appName: 'Pasio Padel Club',
  baseURL: serverEnv.VITE_SITE_URL,
  secret: serverEnv.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema
  }),
  advanced: {
    database: {
      generateId: 'uuid'
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // 5 minutes
    }
  },
  user: {
    deleteUser: {
      enabled: true
    },
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
        required: false
      },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false
      },
      isBlocked: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false
      },
      isAnonymized: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 100
  },
  plugins: [
    tanstackStartCookies(),
    polarPlugin({
      client: polar,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            { productId: POLAR_PRODUCT_IDS.double, slug: 'double' },
            { productId: POLAR_PRODUCT_IDS.simple, slug: 'simple' },
            { productId: POLAR_PRODUCT_IDS.kids, slug: 'kids' }
          ],
          successUrl: '/reservation/success?checkout_id={CHECKOUT_ID}',
          authenticatedUsersOnly: true
        }),
        webhooks({
          secret: serverEnv.POLAR_WEBHOOK_SECRET
        })
      ]
    })
  ]
})

export type Session = typeof auth.$Infer.Session
