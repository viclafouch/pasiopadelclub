import {
  AlertCircleIcon,
  CalendarIcon,
  ClockIcon,
  InfoIcon,
  LoaderIcon,
  MapPinIcon,
  UsersIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { LOCATION_LABELS } from '@/constants/court'
import { POLAR_PRODUCT_IDS } from '@/constants/polar'
import type { CourtType, SelectedSlot } from '@/constants/types'
import { formatDateFr, formatTimeFr } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
import { api } from '~/convex/_generated/api'
import { useConvexMutation } from '@convex-dev/react-query'
import { useMutation } from '@tanstack/react-query'

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
  const initiateMutation = useMutation({
    mutationFn: useConvexMutation(api.bookings.initiate)
  })

  if (!selectedSlot) {
    return null
  }

  const { court, slot } = selectedSlot
  const startDate = new Date(slot.startAt)
  const endDate = new Date(slot.endAt)

  const handlePayClick = async () => {
    const result = await initiateMutation.mutateAsync({
      courtId: court._id,
      startAt: slot.startAt,
      endAt: slot.endAt
    })

    const productId = POLAR_PRODUCT_IDS[court.type as CourtType]
    const metadata = encodeURIComponent(
      JSON.stringify({ bookingId: result.bookingId })
    )
    const checkoutUrl = `/api/checkout?products=${productId}&metadata=${metadata}`

    window.location.href = checkoutUrl
  }

  const errorMessage = initiateMutation.error?.message

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
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700">
            <InfoIcon
              className="mt-0.5 size-4 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <p>Annulation gratuite jusqu&apos;à 24h avant le créneau.</p>
          </div>
          {errorMessage ? (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircleIcon
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              <p>{errorMessage}</p>
            </div>
          ) : null}
        </div>
        <DialogFooter className="border-t bg-muted/30 px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handlePayClick}
            disabled={initiateMutation.isPending}
          >
            {initiateMutation.isPending ? (
              <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            Payer{' '}
            {formatCentsToEuros(court.price, { minimumFractionDigits: 2 })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
