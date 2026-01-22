import React from 'react'
import { LoaderIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { clientEnv } from '@/env/client'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { StripePaymentElementOptions } from '@stripe/stripe-js'
import { STRIPE_FORM_ID, type StripeFormState } from './constants'

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

type StripePaymentFormProps = {
  onSuccess: (paymentIntentId: string) => void
  onStateChange: (state: StripeFormState) => void
  onEscape: () => void
}

export const StripePaymentForm = ({
  onSuccess,
  onStateChange,
  onEscape
}: StripePaymentFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isReady, setIsReady] = React.useState(false)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  const handleReady = () => {
    setIsReady(true)
    onStateChange({ isReady: true, isProcessing: false })
  }

  const handleChange = () => {
    if (error) {
      setError(null)
    }
  }

  const handleLoadError = () => {
    setLoadError(
      'Impossible de charger le formulaire de paiement. Vérifiez votre connexion.'
    )
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
      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment({
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

      if (!paymentIntent?.id) {
        resetProcessingState('Erreur de confirmation du paiement')

        return
      }

      onSuccess(paymentIntent.id)
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
            onChange={handleChange}
            onEscape={onEscape}
            onLoadError={handleLoadError}
            options={PAYMENT_ELEMENT_OPTIONS}
          />
        </div>
      </div>
      {loadError ? (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{loadError}</AlertDescription>
        </Alert>
      ) : error ? (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription className="break-words">{error}</AlertDescription>
        </Alert>
      ) : null}
    </form>
  )
}
