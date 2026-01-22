import React from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants
} from 'motion/react'
import { LoadingButton } from '@/components/loading-button'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { getUserBalanceQueryOpts } from '@/constants/queries'
import type { SelectedSlot } from '@/constants/types'
import { formatCentsToEuros } from '@/helpers/number'
import { createPaymentIntentFn } from '@/server/payment-intent'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BookingSummary } from './booking-summary'
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  CREDIT_FORM_ID,
  type ModalAction,
  type PaymentMethod,
  POLLING_TIMEOUT_MS,
  STRIPE_FORM_ID
} from './constants'
import { StepPayment } from './step-payment'
import { StepRecap } from './step-recap'

type BookingModalProps = {
  onClose: () => void
  selectedSlot: SelectedSlot
}

const SLIDE_VARIANTS = {
  enter: (direction: number) => {
    return {
      translateX: direction > 0 ? 40 : -40,
      opacity: 0
    }
  },
  center: {
    translateX: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      translateX: direction > 0 ? -40 : 40,
      opacity: 0
    }
  }
} as const satisfies Variants

const REDUCED_MOTION_VARIANTS = {
  enter: { opacity: 1 },
  center: { opacity: 1 },
  exit: { opacity: 1 }
} as const satisfies Variants

type ModalState = {
  isPaymentStep: boolean
  paymentMethod: PaymentMethod
  isStripeReady: boolean
  isProcessing: boolean
  pollingStartTime: number | null
}

const INITIAL_MODAL_STATE = {
  isPaymentStep: false,
  paymentMethod: 'card',
  isStripeReady: false,
  isProcessing: false,
  pollingStartTime: null
} as const satisfies ModalState

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case 'GO_TO_PAYMENT':
      return { ...state, isPaymentStep: true }
    case 'BACK_TO_RECAP':
      return { ...state, isPaymentStep: false }
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.method }
    case 'SET_STRIPE_STATE':
      return {
        ...state,
        isStripeReady: action.isReady,
        isProcessing: action.isProcessing
      }
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.isProcessing }
    case 'START_POLLING':
      return { ...state, pollingStartTime: Date.now() }
    default:
      return state
  }
}

export const BookingModal = ({ onClose, selectedSlot }: BookingModalProps) => {
  const queryClient = useQueryClient()
  const shouldReduceMotion = useReducedMotion()
  const [state, dispatch] = React.useReducer(modalReducer, INITIAL_MODAL_STATE)
  const directionRef = React.useRef<1 | -1>(1)
  const contentRef = React.useRef<HTMLDivElement>(null)

  const paymentIntentMutation = useMutation({
    mutationFn: createPaymentIntentFn
  })

  React.useEffect(() => {
    queryClient.prefetchQuery(getUserBalanceQueryOpts())
  }, [queryClient])

  const hasPollingTimedOut =
    state.pollingStartTime !== null &&
    Date.now() - state.pollingStartTime >= POLLING_TIMEOUT_MS

  const isPolling = state.pollingStartTime !== null && !hasPollingTimedOut

  const canClose = !state.isProcessing && !isPolling

  const handleGoToPayment = () => {
    if (!paymentIntentMutation.data && !paymentIntentMutation.isPending) {
      paymentIntentMutation.mutate({
        data: {
          courtId: selectedSlot.court.id,
          startAt: selectedSlot.slot.startAt,
          endAt: selectedSlot.slot.endAt
        }
      })
    }

    directionRef.current = 1
    dispatch({ type: 'GO_TO_PAYMENT' })
    contentRef.current?.focus()
  }

  const handleBackToRecap = () => {
    directionRef.current = -1
    dispatch({ type: 'BACK_TO_RECAP' })
    contentRef.current?.focus()
  }

  const handleClose = () => {
    if (canClose) {
      onClose()
    }
  }

  const slideVariants = shouldReduceMotion
    ? REDUCED_MOTION_VARIANTS
    : SLIDE_VARIANTS

  const animationDuration = shouldReduceMotion ? 0 : ANIMATION_DURATION
  const animationEasing = shouldReduceMotion ? 'linear' : ANIMATION_EASING

  const isDisabled =
    isPolling ||
    (state.paymentMethod === 'card'
      ? !state.isStripeReady ||
        state.isProcessing ||
        paymentIntentMutation.isPending
      : state.isProcessing)

  const paymentFormId =
    state.paymentMethod === 'card' ? STRIPE_FORM_ID : CREDIT_FORM_ID

  const paymentButtonLabel =
    state.paymentMethod === 'card'
      ? `Payer ${formatCentsToEuros(selectedSlot.court.price)}`
      : `Utiliser ${formatCentsToEuros(selectedSlot.court.price)} de crédits`

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent
        aria-describedby={undefined}
        className="flex max-h-modal flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <DialogHeader className="border-b bg-muted/30 px-6 py-4">
          <DialogTitle className="text-center text-lg">
            {state.isPaymentStep ? 'Paiement' : 'Récapitulatif'}
          </DialogTitle>
        </DialogHeader>
        <div
          ref={contentRef}
          tabIndex={-1}
          className="min-h-0 flex-1 overflow-y-auto p-6 outline-none"
        >
          {state.isPaymentStep ? (
            <AnimatePresence mode="wait" custom={directionRef.current}>
              <motion.div
                key="payment"
                custom={directionRef.current}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: animationDuration,
                  ease: animationEasing
                }}
              >
                <div className="mb-6">
                  <BookingSummary selectedSlot={selectedSlot} />
                </div>
                <StepPayment
                  selectedSlot={selectedSlot}
                  paymentIntentMutation={paymentIntentMutation}
                  paymentMethod={state.paymentMethod}
                  isPolling={isPolling}
                  hasPollingTimedOut={hasPollingTimedOut}
                  dispatch={dispatch}
                  onEscape={handleClose}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <StepRecap selectedSlot={selectedSlot} />
          )}
        </div>
        <DialogFooter className="flex-row justify-between gap-2 border-t bg-muted/30 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={state.isPaymentStep ? handleBackToRecap : handleClose}
            disabled={!canClose}
          >
            {state.isPaymentStep ? (
              <>
                <ArrowLeftIcon aria-hidden="true" />
                Retour
              </>
            ) : (
              'Annuler'
            )}
          </Button>
          {state.isPaymentStep ? (
            <LoadingButton
              type="submit"
              form={paymentFormId}
              isLoading={state.isProcessing}
              disabled={isDisabled}
            >
              {paymentButtonLabel}
            </LoadingButton>
          ) : (
            <Button type="button" onClick={handleGoToPayment}>
              Suivant
              <ArrowRightIcon aria-hidden="true" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
