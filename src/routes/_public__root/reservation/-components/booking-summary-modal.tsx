import React from 'react'
import {
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  InfoIcon,
  MapPinIcon,
  UsersIcon,
  WalletIcon
} from 'lucide-react'
import { LoadingButton } from '@/components/loading-button'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { LOCATION_LABELS } from '@/constants/court'
import { getUserBalanceQueryOpts } from '@/constants/queries'
import type { BookingSlotData, SelectedSlot } from '@/constants/types'
import { formatDateFr, formatTimeFr } from '@/helpers/date'
import { getErrorMessage } from '@/helpers/error'
import { formatCentsToEuros } from '@/helpers/number'
import { cn } from '@/lib/utils'
import { createCheckoutSessionFn } from '@/server/checkout'
import { payBookingWithCreditsFn } from '@/server/credit-payment'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouteContext } from '@tanstack/react-router'

type PaymentMethod = 'card' | 'credit'

type BookingSummaryModalProps = {
  isOpen: boolean
  onClose: () => void
  selectedSlot: SelectedSlot | null
}

export const BookingSummaryModal = ({
  isOpen,
  onClose,
  selectedSlot
}: BookingSummaryModalProps) => {
  const { user } = useRouteContext({ from: '/_public__root' })
  const isLoggedIn = user !== null
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [paymentMethod, setPaymentMethod] =
    React.useState<PaymentMethod>('card')

  const balanceQuery = useQuery({
    ...getUserBalanceQueryOpts(),
    enabled: isLoggedIn && isOpen
  })

  const checkoutMutation = useMutation({
    mutationFn: async (slotData: BookingSlotData) => {
      const result = await createCheckoutSessionFn({ data: slotData })
      window.location.href = result.url
    }
  })

  const creditMutation = useMutation({
    mutationFn: async (slotData: BookingSlotData) => {
      await payBookingWithCreditsFn({ data: slotData })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['wallet'] })
      await queryClient.invalidateQueries({ queryKey: ['bookings'] })
      await queryClient.invalidateQueries({ queryKey: ['slots'] })
      navigate({ to: '/reservation/success' })
    }
  })

  if (!selectedSlot) {
    return null
  }

  const { court, slot } = selectedSlot
  const startDate = new Date(slot.startAt)
  const endDate = new Date(slot.endAt)

  const balance = balanceQuery.data ?? 0
  const hasEnoughCredits = balance >= court.price
  const isPending = checkoutMutation.isPending || creditMutation.isPending
  const error = checkoutMutation.error ?? creditMutation.error

  const handlePayClick = () => {
    const slotData = {
      courtId: court.id,
      startAt: slot.startAt,
      endAt: slot.endAt
    }

    if (paymentMethod === 'credit') {
      creditMutation.mutate(slotData)
    } else {
      checkoutMutation.mutate(slotData)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden p-0">
        <div className="bg-gradient-to-br from-primary to-primary/80 px-6 py-5 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary-foreground">
              {court.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 flex items-center gap-4 text-sm text-primary-foreground/90">
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="size-4" aria-hidden="true" />
              {LOCATION_LABELS[court.location]}
            </span>
            <span className="flex items-center gap-1.5">
              <UsersIcon className="size-4" aria-hidden="true" />
              {court.capacity} joueurs
            </span>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center gap-4 rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/15">
              <CalendarIcon
                className="size-6 text-primary"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-lg font-bold">{formatDateFr(startDate)}</p>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <ClockIcon className="size-4" aria-hidden="true" />
                {formatTimeFr(startDate)} - {formatTimeFr(endDate)} (
                {court.duration} min)
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
            <span className="font-medium">Total à payer</span>
            <span className="text-2xl font-bold text-primary">
              {formatCentsToEuros(court.price, { minimumFractionDigits: 2 })}
            </span>
          </div>
          {isLoggedIn ? (
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Mode de paiement</legend>
              <div
                role="radiogroup"
                aria-label="Mode de paiement"
                className="grid grid-cols-2 gap-3"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentMethod === 'card'}
                  onClick={() => {
                    setPaymentMethod('card')
                  }}
                  disabled={isPending}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all',
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <CreditCardIcon
                    className={cn(
                      'size-5',
                      paymentMethod === 'card'
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium">Carte bancaire</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentMethod === 'credit'}
                  aria-describedby={
                    !hasEnoughCredits && balance > 0
                      ? 'credits-insufficient'
                      : undefined
                  }
                  onClick={() => {
                    if (hasEnoughCredits) {
                      setPaymentMethod('credit')
                    }
                  }}
                  disabled={isPending}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all',
                    paymentMethod === 'credit'
                      ? 'border-primary bg-primary/5'
                      : 'border-border',
                    hasEnoughCredits ? 'hover:border-primary/50' : 'opacity-50'
                  )}
                >
                  <WalletIcon
                    className={cn(
                      'size-5',
                      paymentMethod === 'credit'
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium">
                    Crédits ({formatCentsToEuros(balance)})
                  </span>
                </button>
              </div>
              {!hasEnoughCredits && balance > 0 ? (
                <p
                  id="credits-insufficient"
                  className="text-xs text-muted-foreground"
                >
                  Solde insuffisant pour payer en crédits
                </p>
              ) : null}
            </fieldset>
          ) : null}
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700">
            <InfoIcon
              className="mt-0.5 size-4 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <p>Annulation gratuite jusqu&apos;à 24h avant le créneau.</p>
          </div>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {getErrorMessage(error)}
            </p>
          ) : null}
        </div>
        <DialogFooter className="border-t bg-muted/30 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Annuler
          </Button>
          <LoadingButton
            type="button"
            onClick={handlePayClick}
            isLoading={isPending}
          >
            {paymentMethod === 'credit'
              ? `Utiliser ${formatCentsToEuros(court.price)} de crédits`
              : `Payer ${formatCentsToEuros(court.price)}`}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
