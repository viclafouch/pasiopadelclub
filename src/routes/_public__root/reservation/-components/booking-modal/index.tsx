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
  type PaymentMethod,
  STRIPE_FORM_ID
} from './constants'
import { StepPayment } from './step-payment'
import { StepRecap } from './step-recap'

type BookingModalProps = {
  onClose: () => void
  selectedSlot: SelectedSlot
}

type StripeFormState = {
  isReady: boolean
  isProcessing: boolean
}

const INITIAL_STRIPE_FORM_STATE: StripeFormState = {
  isReady: false,
  isProcessing: false
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

export const BookingModal = ({ onClose, selectedSlot }: BookingModalProps) => {
  const queryClient = useQueryClient()
  const shouldReduceMotion = useReducedMotion()
  const [isPaymentStep, setIsPaymentStep] = React.useState(false)
  const [paymentMethod, setPaymentMethod] =
    React.useState<PaymentMethod>('card')
  const [stripeFormState, setStripeFormState] = React.useState<StripeFormState>(
    INITIAL_STRIPE_FORM_STATE
  )
  const [isCreditProcessing, setIsCreditProcessing] = React.useState(false)
  const directionRef = React.useRef<1 | -1>(1)
  const contentRef = React.useRef<HTMLDivElement>(null)

  const paymentIntentMutation = useMutation({
    mutationFn: createPaymentIntentFn
  })

  const handleClose = () => {
    setIsPaymentStep(false)
    setPaymentMethod('card')
    setStripeFormState(INITIAL_STRIPE_FORM_STATE)
    setIsCreditProcessing(false)
    paymentIntentMutation.reset()
    onClose()
  }

  const handleGoToPayment = () => {
    queryClient.prefetchQuery(getUserBalanceQueryOpts())

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
    setIsPaymentStep(true)
    contentRef.current?.focus()
  }

  const handleBackToRecap = () => {
    directionRef.current = -1
    setIsPaymentStep(false)
    contentRef.current?.focus()
  }

  const handleStripeStateChange = (state: StripeFormState) => {
    setStripeFormState(state)
  }

  const handleCreditProcessingChange = (isProcessing: boolean) => {
    setIsCreditProcessing(isProcessing)
  }

  const slideVariants = shouldReduceMotion
    ? REDUCED_MOTION_VARIANTS
    : SLIDE_VARIANTS

  const animationDuration = shouldReduceMotion ? 0 : ANIMATION_DURATION
  const animationEasing = shouldReduceMotion ? 'linear' : ANIMATION_EASING

  const isProcessing =
    paymentMethod === 'card' ? stripeFormState.isProcessing : isCreditProcessing

  const isDisabled =
    paymentMethod === 'card'
      ? !stripeFormState.isReady ||
        stripeFormState.isProcessing ||
        paymentIntentMutation.isPending
      : isCreditProcessing

  const paymentFormId =
    paymentMethod === 'card' ? STRIPE_FORM_ID : CREDIT_FORM_ID

  const paymentButtonLabel =
    paymentMethod === 'card'
      ? `Payer ${formatCentsToEuros(selectedSlot.court.price, { minimumFractionDigits: 2 })}`
      : `Payer ${formatCentsToEuros(selectedSlot.court.price)} avec mes crédits`

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent
        aria-describedby={undefined}
        className="flex max-h-modal flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <DialogHeader className="border-b bg-muted/30 px-6 py-4">
          <DialogTitle className="text-center text-lg">
            {isPaymentStep ? 'Paiement' : 'Récapitulatif'}
          </DialogTitle>
        </DialogHeader>
        <div
          ref={contentRef}
          tabIndex={-1}
          className="min-h-0 flex-1 overflow-y-auto p-6 outline-none"
        >
          <div className="mb-4">
            <BookingSummary selectedSlot={selectedSlot} />
          </div>
          <AnimatePresence
            mode="wait"
            custom={directionRef.current}
            initial={false}
          >
            <motion.div
              key={isPaymentStep ? 'payment' : 'recap'}
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
              {isPaymentStep ? (
                <StepPayment
                  selectedSlot={selectedSlot}
                  paymentIntentMutation={paymentIntentMutation}
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                  onStripeStateChange={handleStripeStateChange}
                  onCreditProcessingChange={handleCreditProcessingChange}
                />
              ) : (
                <StepRecap />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <DialogFooter className="flex-row justify-between gap-2 border-t bg-muted/30 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={isPaymentStep ? handleBackToRecap : onClose}
            disabled={isProcessing}
          >
            {isPaymentStep ? (
              <>
                <ArrowLeftIcon aria-hidden="true" />
                Retour
              </>
            ) : (
              'Annuler'
            )}
          </Button>
          {isPaymentStep ? (
            <LoadingButton
              type="submit"
              form={paymentFormId}
              isLoading={isProcessing}
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
