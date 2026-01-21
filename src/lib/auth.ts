import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import * as schema from '@/db/schema'
import {
  PasswordChangedEmail,
  ResetPasswordEmail,
  VerificationEmail,
  WelcomeEmail
} from '@/emails'
import { serverEnv } from '@/env/server'
import { formatDateTimeLongFr } from '@/helpers/date'
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
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      '/sign-in/email': {
        window: 900,
        max: 5
      },
      '/sign-up/email': {
        window: 3600,
        max: 3
      },
      '/forget-password': {
        window: 3600,
        max: 3
      },
      '/reset-password': {
        window: 900,
        max: 5
      }
    }
  },
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
          react: ResetPasswordEmail({
            firstName: extractFirstName(user.name),
            resetUrl: url
          })
        })
        // eslint-disable-next-line no-console
        .catch(console.error)
    },
    onPasswordReset: async ({ user }) => {
      await db.delete(schema.session).where(eq(schema.session.userId, user.id))

      resend.emails
        .send({
          from: EMAIL_FROM,
          to: getEmailRecipient(user.email),
          subject: 'Votre mot de passe a été modifié - Pasio Padel Club',
          react: PasswordChangedEmail({
            firstName: extractFirstName(user.name),
            changeDate: formatDateTimeLongFr(new Date())
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
