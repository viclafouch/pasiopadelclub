import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { VerificationEmail, WelcomeEmail } from '@/emails'
import { serverEnv } from '@/env/server'
import { extractFirstName } from '@/helpers/string'
import {
  matchWasEmailVerified,
  parseUserUpdateData
} from '@/helpers/type-guards'
import { EMAIL_FROM, getEmailRecipient, resend } from './resend.server'

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
    maxPasswordLength: 100,
    sendResetPassword: async ({ user, url }) => {
      resend.emails
        .send({
          from: EMAIL_FROM,
          to: getEmailRecipient(user.email),
          subject: 'Réinitialisez votre mot de passe - Pasio Padel Club',
          react: VerificationEmail({
            firstName: extractFirstName(user.name),
            verificationUrl: url
          })
        })
        // eslint-disable-next-line no-console
        .catch(console.error)
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      resend.emails
        .send({
          from: EMAIL_FROM,
          to: getEmailRecipient(user.email),
          subject: 'Confirmez votre adresse email - Pasio Padel Club',
          react: VerificationEmail({
            firstName: extractFirstName(user.name),
            verificationUrl: url
          })
        })
        // eslint-disable-next-line no-console
        .catch(console.error)
    }
  },
  databaseHooks: {
    user: {
      update: {
        after: async ({ data, previousData }) => {
          const parsed = parseUserUpdateData(data)

          if (!parsed.success) {
            return
          }

          const { emailVerified, email, name } = parsed.data
          const wasAlreadyVerified = matchWasEmailVerified(previousData)

          if (emailVerified && !wasAlreadyVerified) {
            resend.emails
              .send({
                from: EMAIL_FROM,
                to: getEmailRecipient(email),
                subject: 'Bienvenue chez Pasio Padel Club !',
                react: WelcomeEmail({
                  firstName: extractFirstName(name)
                })
              })
              // eslint-disable-next-line no-console
              .catch(console.error)
          }
        }
      }
    }
  },
  plugins: [tanstackStartCookies()]
})

export type Session = typeof auth.$Infer.Session
