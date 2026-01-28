import React from 'react'
import { InfoIcon, LockIcon, MailIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  getAuthUserQueryOpts,
  getUserBalanceQueryOpts
} from '@/constants/queries'
import type { BookingSlotData, SelectedSlot } from '@/constants/types'
import { getErrorMessage } from '@/helpers/error'
import { formatCentsToEuros } from '@/helpers/number'
import { getBookingByPaymentIntentFn } from '@/server/booking-status'
import { payBookingWithCreditsFn } from '@/server/credit-payment'
import type { createPaymentIntentFn } from '@/server/payment-intent'
import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { CardPaymentContent } from './card-payment-content'
import {
  CREDIT_FORM_ID,
  type ModalAction,
  type PaymentMethod,
  POLLING_INTERVAL_MS
} from './constants'
import { PaymentMethodSelector } from './payment-method-selector'

type PaymentIntentResult = Awaited<ReturnType<typeof createPaymentIntentFn>>

type StepPaymentProps = {
  selectedSlot: SelectedSlot
  paymentIntentMutation: UseMutationResult<
    PaymentIntentResult,
    Error,
    { data: BookingSlotData }
  >
  paymentMethod: PaymentMethod
  isPolling: boolean
  hasPollingTimedOut: boolean
  dispatch: React.Dispatch<ModalAction>
  onEscape: () => void
}

export const StepPayment = ({
  selectedSlot,
  paymentIntentMutation,
  paymentMethod,
  isPolling,
  hasPollingTimedOut,
  dispatch,
  onEscape
}: StepPaymentProps) => {
  const navigate = useNavigate()
  const { court, slot } = selectedSlot
  const authUserQuery = useQuery(getAuthUserQueryOpts())
  const balanceQuery = useQuery(getUserBalanceQueryOpts())
  const [paymentIntentId, setPaymentIntentId] = React.useState<string | null>(
    null
  )

  const bookingStatusQuery = useQuery({
    queryKey: ['booking-status', paymentIntentId],
    queryFn: () => {
      return getBookingByPaymentIntentFn({
        data: { paymentIntentId: paymentIntentId! }
      })
    },
    enabled: paymentIntentId !== null && isPolling,
    retry: 2,
    retryDelay: 1000,
    refetchInterval: (query) => {
      if (query.state.data?.found) {
        return false
      }

      return POLLING_INTERVAL_MS
    }
  })

  const hasPollingError =
    bookingStatusQuery.isError && bookingStatusQuery.failureCount >= 3

  React.useEffect(() => {
    if (bookingStatusQuery.data?.found) {
      void navigate({ to: '/reservation/success' })
    }
  }, [bookingStatusQuery.data, navigate])

  const creditMutation = useMutation({
    mutationFn: (data: BookingSlotData) => {
      return payBookingWithCreditsFn({ data })
    },
    onMutate: () => {
      dispatch({ type: 'SET_PROCESSING', isProcessing: true })
    },
    onSettled: () => {
      dispatch({ type: 'SET_PROCESSING', isProcessing: false })
    },
    onSuccess: () => {
      void navigate({ to: '/reservation/success' })
    }
  })

  const handleCreditSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    creditMutation.mutate({
      courtId: court.id,
      startAt: slot.startAt,
      endAt: slot.endAt
    })
  }

  const handleStripeSuccess = (intentId: string) => {
    setPaymentIntentId(intentId)
    dispatch({ type: 'START_POLLING' })
  }

  const handleStripeStateChange = (stripeState: {
    isReady: boolean
    isProcessing: boolean
  }) => {
    dispatch({
      type: 'SET_STRIPE_STATE',
      isReady: stripeState.isReady,
      isProcessing: stripeState.isProcessing
    })
  }

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', method })
  }

  return (
    <div className="space-y-6">
      <PaymentMethodSelector
        selectedMethod={paymentMethod}
        onMethodChange={handlePaymentMethodChange}
        balanceQuery={balanceQuery}
        courtPrice={court.price}
        isDisabled={creditMutation.isPending || isPolling}
      />
      {paymentMethod === 'card' ? (
        <div className="space-y-4">
          <CardPaymentContent
            isPolling={isPolling}
            hasPollingError={hasPollingError}
            hasPollingTimedOut={hasPollingTimedOut}
            paymentIntentMutation={paymentIntentMutation}
            onStripeSuccess={handleStripeSuccess}
            onStripeStateChange={handleStripeStateChange}
            onEscape={onEscape}
          />
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
