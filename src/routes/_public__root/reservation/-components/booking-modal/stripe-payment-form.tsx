import React from 'react'
import { LoaderIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { clientEnv } from '@/env/client'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { StripePaymentElementOptions } from '@stripe/stripe-js'
import { STRIPE_FORM_ID } from './constants'

const PAYMENT_ELEMENT_OPTIONS = {
  layout: {
    type: 'accordion',
    radios: true,
    spacedAccordionItems: true
  },
  business: { name: 'Pasio Padel Club' },
  wallets: {
    link: 'never'
  }
} as const satisfies StripePaymentElementOptions

type StripeFormState = {
  isReady: boolean
  isProcessing: boolean
}

type StripePaymentFormProps = {
  onSuccess: () => void
  onStateChange: (state: StripeFormState) => void
}

export const StripePaymentForm = ({
  onSuccess,
  onStateChange
}: StripePaymentFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isReady, setIsReady] = React.useState(false)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleReady = () => {
    setIsReady(true)
    onStateChange({ isReady: true, isProcessing: false })
  }

  const resetProcessingState = (errorMessage: string) => {
    setError(errorMessage)
    setIsProcessing(false)
    onStateChange({ isReady: true, isProcessing: false })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)
    onStateChange({ isReady: true, isProcessing: true })

    try {
      const { error: submitError } = await elements.submit()

      if (submitError) {
        resetProcessingState(submitError.message ?? 'Une erreur est survenue')

        return
      }

      /* eslint-disable camelcase */
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${clientEnv.VITE_SITE_URL}/reservation/success`
        },
        redirect: 'if_required'
      })
      /* eslint-enable camelcase */

      if (confirmError) {
        resetProcessingState(confirmError.message ?? 'Le paiement a échoué')

        return
      }

      onSuccess()
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Une erreur inattendue est survenue'
      resetProcessingState(message)
    }
  }

  return (
    <form
      id={STRIPE_FORM_ID}
      onSubmit={handleSubmit}
      aria-busy={isProcessing}
      aria-label="Formulaire de paiement"
    >
      <div className="relative min-h-stripe-form">
        {!isReady ? (
          <div
            className="absolute inset-0 flex items-center justify-center"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />
              Préparation du formulaire de paiement...
            </div>
          </div>
        ) : null}
        <div
          className={isReady ? 'opacity-100' : 'pointer-events-none opacity-0'}
        >
          <PaymentElement
            onReady={handleReady}
            options={PAYMENT_ELEMENT_OPTIONS}
          />
        </div>
      </div>
      {error ? (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription className="break-words">{error}</AlertDescription>
        </Alert>
      ) : null}
    </form>
  )
}
