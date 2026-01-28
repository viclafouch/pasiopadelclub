import { CheckIcon, LoaderIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { BookingSlotData } from '@/constants/types'
import { getErrorMessage } from '@/helpers/error'
import { stripePromise } from '@/lib/stripe.client'
import type { createPaymentIntentFn } from '@/server/payment-intent'
import { Elements } from '@stripe/react-stripe-js'
import type { StripeElementsOptions } from '@stripe/stripe-js'
import type { UseMutationResult } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { STRIPE_APPEARANCE, type StripeFormState } from './constants'
import { StripePaymentForm } from './stripe-payment-form'

type PaymentIntentResult = Awaited<ReturnType<typeof createPaymentIntentFn>>

type CardPaymentContentProps = {
  isPolling: boolean
  hasPollingError: boolean
  hasPollingTimedOut: boolean
  paymentIntentMutation: UseMutationResult<
    PaymentIntentResult,
    Error,
    { data: BookingSlotData }
  >
  onStripeSuccess: (paymentIntentId: string) => void
  onStripeStateChange: (state: StripeFormState) => void
  onEscape: () => void
}

export const CardPaymentContent = ({
  isPolling,
  hasPollingError,
  hasPollingTimedOut,
  paymentIntentMutation,
  onStripeSuccess,
  onStripeStateChange,
  onEscape
}: CardPaymentContentProps) => {
  const shouldReduceMotion = useReducedMotion()

  const elementsOptions: StripeElementsOptions | undefined =
    paymentIntentMutation.data
      ? {
          clientSecret: paymentIntentMutation.data.clientSecret,
          appearance: STRIPE_APPEARANCE,
          locale: 'fr'
        }
      : undefined

  if (isPolling && !hasPollingError) {
    return (
      <div className="flex min-h-stripe-form flex-col items-center justify-center gap-4">
        <motion.div
          initial={
            shouldReduceMotion
              ? { scale: 1, opacity: 1 }
              : { scale: 0, opacity: 0 }
          }
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex size-14 items-center justify-center rounded-full bg-primary/10"
        >
          <CheckIcon
            className="size-7 text-primary"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </motion.div>
        <motion.div
          initial={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 0, translateY: 10 }
          }
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: 0.3 }}
          className="space-y-1 text-center"
        >
          <p className="text-sm font-medium text-primary">Paiement accepté</p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />
            Finalisation de votre réservation...
          </p>
        </motion.div>
      </div>
    )
  }

  if (hasPollingError) {
    return (
      <Alert>
        <AlertDescription className="space-y-2">
          <p className="flex items-center gap-2 font-medium">
            <CheckIcon className="size-4 text-primary" aria-hidden="true" />
            Paiement accepté
          </p>
          <p>
            Problème de connexion lors de la confirmation. Vérifiez vos
            réservations dans{' '}
            <Link
              to="/mon-compte"
              search={{ tab: 'reservations' }}
              className="font-medium underline"
            >
              votre compte
            </Link>{' '}
            ou attendez l&apos;email de confirmation.
          </p>
        </AlertDescription>
      </Alert>
    )
  }

  if (hasPollingTimedOut) {
    return (
      <Alert>
        <AlertDescription className="space-y-2">
          <p className="flex items-center gap-2 font-medium">
            <CheckIcon className="size-4 text-primary" aria-hidden="true" />
            Paiement accepté
          </p>
          <p>
            La confirmation prend plus de temps que prévu. Vous recevrez un
            email sous peu ou consultez{' '}
            <Link
              to="/mon-compte"
              search={{ tab: 'reservations' }}
              className="font-medium underline"
            >
              vos réservations
            </Link>
            .
          </p>
        </AlertDescription>
      </Alert>
    )
  }

  if (paymentIntentMutation.isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {getErrorMessage(paymentIntentMutation.error)}
        </AlertDescription>
      </Alert>
    )
  }

  if (elementsOptions) {
    return (
      <Elements stripe={stripePromise} options={elementsOptions}>
        <StripePaymentForm
          onSuccess={onStripeSuccess}
          onStateChange={onStripeStateChange}
          onEscape={onEscape}
        />
      </Elements>
    )
  }

  return (
    <div className="flex min-h-stripe-form items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />
        Chargement...
      </div>
    </div>
  )
}
