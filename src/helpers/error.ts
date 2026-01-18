import { getStripeErrorMessage, matchIsStripeError } from './stripe-errors'

export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') {
    return error
  }

  if (matchIsStripeError(error)) {
    return getStripeErrorMessage(error)
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return 'Erreur de validation'
}
