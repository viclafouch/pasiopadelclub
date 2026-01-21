import { InfoIcon, LoaderIcon, LockIcon, MailIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  getAuthUserQueryOpts,
  getUserBalanceQueryOpts
} from '@/constants/queries'
import type { BookingSlotData, SelectedSlot } from '@/constants/types'
import { getErrorMessage } from '@/helpers/error'
import { formatCentsToEuros } from '@/helpers/number'
import { stripePromise } from '@/lib/stripe.client'
import { payBookingWithCreditsFn } from '@/server/credit-payment'
import type { createPaymentIntentFn } from '@/server/payment-intent'
import { Elements } from '@stripe/react-stripe-js'
import type { StripeElementsOptions } from '@stripe/stripe-js'
import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  BOOKING_QUERY_KEYS,
  CREDIT_FORM_ID,
  type PaymentMethod,
  STRIPE_APPEARANCE
} from './constants'
import { PaymentMethodSelector } from './payment-method-selector'
import { StripePaymentForm } from './stripe-payment-form'

type PaymentIntentResult = Awaited<ReturnType<typeof createPaymentIntentFn>>

type StripeFormState = {
  isReady: boolean
  isProcessing: boolean
}

type StepPaymentProps = {
  selectedSlot: SelectedSlot
  paymentIntentMutation: UseMutationResult<
    PaymentIntentResult,
    Error,
    { data: BookingSlotData }
  >
  paymentMethod: PaymentMethod
  onPaymentMethodChange: (method: PaymentMethod) => void
  onStripeStateChange: (state: StripeFormState) => void
  onCreditProcessingChange: (isProcessing: boolean) => void
  onEscape: () => void
}

export const StepPayment = ({
  selectedSlot,
  paymentIntentMutation,
  paymentMethod,
  onPaymentMethodChange,
  onStripeStateChange,
  onCreditProcessingChange,
  onEscape
}: StepPaymentProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { court, slot } = selectedSlot
  const authUserQuery = useQuery(getAuthUserQueryOpts())
  const balanceQuery = useQuery(getUserBalanceQueryOpts())

  const invalidateBookingQueries = () => {
    return Promise.all(
      BOOKING_QUERY_KEYS.map((key) => {
        return queryClient.invalidateQueries({
          queryKey: [key],
          refetchType: 'all'
        })
      })
    )
  }

  const creditMutation = useMutation({
    mutationFn: (data: BookingSlotData) => {
      return payBookingWithCreditsFn({ data })
    },
    onMutate: () => {
      onCreditProcessingChange(true)
    },
    onSettled: () => {
      onCreditProcessingChange(false)
    },
    onSuccess: async () => {
      await invalidateBookingQueries()
      navigate({ to: '/reservation/success' })
    }
  })

  const handleCreditSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    creditMutation.mutate({
      courtId: court.id,
      startAt: slot.startAt,
      endAt: slot.endAt
    })
  }

  const handleStripeSuccess = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
    await invalidateBookingQueries()
    navigate({ to: '/reservation/success' })
  }

  const elementsOptions: StripeElementsOptions | undefined =
    paymentIntentMutation.data
      ? {
          clientSecret: paymentIntentMutation.data.clientSecret,
          appearance: STRIPE_APPEARANCE,
          locale: 'fr'
        }
      : undefined

  return (
    <div className="space-y-2">
      <PaymentMethodSelector
        selectedMethod={paymentMethod}
        onMethodChange={onPaymentMethodChange}
        balanceQuery={balanceQuery}
        courtPrice={court.price}
        isDisabled={creditMutation.isPending}
      />
      {paymentMethod === 'card' ? (
        <div>
          {paymentIntentMutation.isError ? (
            <Alert variant="destructive">
              <AlertDescription>
                {getErrorMessage(paymentIntentMutation.error)}
              </AlertDescription>
            </Alert>
          ) : elementsOptions ? (
            <Elements stripe={stripePromise} options={elementsOptions}>
              <StripePaymentForm
                onSuccess={handleStripeSuccess}
                onStateChange={onStripeStateChange}
                onEscape={onEscape}
              />
            </Elements>
          ) : (
            <div className="flex min-h-stripe-form items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderIcon
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
                Chargement...
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="rounded-lg border bg-muted/30 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Solde après paiement
            </p>
            <p className="text-xl font-bold">
              {formatCentsToEuros((balanceQuery.data ?? 0) - court.price)}
            </p>
          </div>
          {creditMutation.error ? (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>
                {getErrorMessage(creditMutation.error)}
              </AlertDescription>
            </Alert>
          ) : null}
          <form id={CREDIT_FORM_ID} onSubmit={handleCreditSubmit} />
        </div>
      )}
      <div className="space-y-2 text-center text-xs text-muted-foreground">
        <p>
          <LockIcon
            className="mr-1.5 inline-block size-3.5 align-text-bottom"
            aria-hidden="true"
          />
          Paiement sécurisé par Stripe
        </p>
        <p>
          <MailIcon
            className="mr-1.5 inline-block size-3.5 align-text-bottom"
            aria-hidden="true"
          />
          Confirmation envoyée à{' '}
          <span className="font-medium text-foreground">
            {authUserQuery.data?.email}
          </span>
        </p>
        <p>
          <InfoIcon
            className="mr-1.5 inline-block size-3.5 align-text-bottom"
            aria-hidden="true"
          />
          Annulation : 100% si +24h avant, 50% si -24h avant
        </p>
        <p>
          En payant, vous acceptez nos{' '}
          <Link to="/cgv" className="underline hover:text-foreground">
            conditions générales de vente
          </Link>
        </p>
      </div>
    </div>
  )
}
