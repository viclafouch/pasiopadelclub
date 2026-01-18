import { getStripeErrorMessage } from './stripe-errors'

function matchIsStripeError(
  error: unknown
): error is { code?: string; type?: string; message?: string } {
  return (
    error !== null &&
    typeof error === 'object' &&
    'type' in error &&
    typeof error.type === 'string' &&
    error.type.startsWith('Stripe')
  )
}

export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') {
    return error
  }

  if (matchIsStripeError(error) && error.code) {
    return getStripeErrorMessage(error.code)
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return 'Erreur de validation'
}
