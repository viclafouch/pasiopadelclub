import React from 'react'
import {
  CheckIcon,
  InfoIcon,
  LoaderIcon,
  LockIcon,
  MailIcon
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  getAuthUserQueryOpts,
  getUserBalanceQueryOpts
} from '@/constants/queries'
import type { BookingSlotData, SelectedSlot } from '@/constants/types'
import { getErrorMessage } from '@/helpers/error'
import { formatCentsToEuros } from '@/helpers/number'
import { stripePromise } from '@/lib/stripe.client'
import { getBookingByPaymentIntentFn } from '@/server/booking-status'
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
  type ModalAction,
  type PaymentMethod,
  POLLING_INTERVAL_MS,
  STRIPE_APPEARANCE
} from './constants'
import { PaymentMethodSelector } from './payment-method-selector'
import { StripePaymentForm } from './stripe-payment-form'

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
  const queryClient = useQueryClient()
  const shouldReduceMotion = useReducedMotion()
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

  const invalidateBookingQueries = React.useCallback(() => {
    return Promise.all(
      BOOKING_QUERY_KEYS.map((key) => {
        return queryClient.invalidateQueries({
          queryKey: [key],
          refetchType: 'all'
        })
      })
    )
  }, [queryClient])

  React.useEffect(() => {
    if (bookingStatusQuery.data?.found) {
      invalidateBookingQueries().then(() => {
        navigate({ to: '/reservation/success' })
      })
    }
  }, [bookingStatusQuery.data, invalidateBookingQueries, navigate])

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

  const elementsOptions: StripeElementsOptions | undefined =
    paymentIntentMutation.data
      ? {
          clientSecret: paymentIntentMutation.data.clientSecret,
          appearance: STRIPE_APPEARANCE,
          locale: 'fr'
        }
      : undefined

  const renderCardPaymentContent = () => {
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
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, translateY: 10 }
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
            onSuccess={handleStripeSuccess}
            onStateChange={handleStripeStateChange}
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
        <div className="space-y-4">{renderCardPaymentContent()}</div>
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
