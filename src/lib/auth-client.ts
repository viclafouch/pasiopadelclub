import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { clientEnv } from '@/env/client'
import { polarClient } from '@polar-sh/better-auth'

export const authClient = createAuthClient({
  baseURL: clientEnv.VITE_SITE_URL,
  plugins: [
    polarClient(),
    inferAdditionalFields({
      user: {
        firstName: { type: 'string', required: true },
        lastName: { type: 'string', required: true },
        phone: { type: 'string', required: false },
        role: { type: 'string', required: false },
        isBlocked: { type: 'boolean', required: false },
        isAnonymized: { type: 'boolean', required: false }
      }
    })
  ]
})

export const { useSession, signIn, signUp, signOut } = authClient
