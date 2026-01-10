import type { authClient } from './auth-client'

type ErrorCode = keyof typeof authClient.$ERROR_CODES

const ERROR_MESSAGES = {
  INVALID_EMAIL_OR_PASSWORD: 'Email ou mot de passe incorrect',
  EMAIL_NOT_VERIFIED: 'Veuillez vérifier votre email avant de vous connecter',
  USER_NOT_FOUND: 'Email ou mot de passe incorrect',
  USER_ALREADY_EXISTS: 'Un compte existe déjà avec cette adresse email',
  INVALID_EMAIL: 'Adresse email invalide',
  INVALID_PASSWORD: 'Mot de passe invalide'
} satisfies Partial<Record<ErrorCode, string>>

type BetterAuthError = {
  code?: string
  message?: string
  status?: number
}

export const getAuthErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'code' in error) {
    const { code } = error as BetterAuthError

    if (code && code in ERROR_MESSAGES) {
      return ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES]
    }
  }

  return 'Une erreur est survenue'
}
