import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { serverEnv } from '@/env/server'

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
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
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
  plugins: [tanstackStartCookies()]
})

export type Session = typeof auth.$Infer.Session
