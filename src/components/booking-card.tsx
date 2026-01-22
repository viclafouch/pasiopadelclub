import {
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  MapPinIcon,
  TimerIcon,
  UsersIcon,
  WalletIcon,
  XIcon
} from 'lucide-react'
import {
  type BookingStatus,
  Status,
  StatusIndicator,
  StatusLabel
} from '@/components/kibo-ui/status'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import type { Booking, BookingWithCourt } from '@/constants/types'
import { formatDateFr, formatDateWithDayFr, formatTimeFr } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
import { cn } from '@/lib/utils'
import { matchIsBookingInProgress } from '@/utils/booking'
import { getLocationLabel } from '@/utils/court'

type BookingCardProps = {
  booking: BookingWithCourt
  onCancel?: (bookingId: Booking['id']) => void
  showCancelButton?: boolean
  isHistory?: boolean
}

const getRefundPercentage = (booking: BookingWithCourt): number | null => {
  if (booking.status !== 'cancelled' || booking.refundedAmountCents === null) {
    return null
  }

  return Math.round((booking.refundedAmountCents / booking.price) * 100)
}

const getDisplayStatus = (
  booking: BookingWithCourt,
  isHistory: boolean
): BookingStatus => {
  if (booking.status === 'cancelled') {
    return 'cancelled'
  }

  if (isHistory) {
    return 'past'
  }

  if (matchIsBookingInProgress(booking)) {
    return 'in-progress'
  }

  return 'confirmed'
}

type RefundBadgeProps = {
  percentage: number
}

const RefundBadge = ({ percentage }: RefundBadgeProps) => {
  const isFullRefund = percentage === 100

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1 text-xs font-medium',
        isFullRefund
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
          : 'border-amber-500/30 bg-amber-500/10 text-amber-700'
      )}
    >
      Remboursé {percentage}%
    </Badge>
  )
}

type BookingFooterInfoProps = {
  isCancelled: boolean
  refundPercentage: number | null
  createdAt: Date
}

const BookingFooterInfo = ({
  isCancelled,
  refundPercentage,
  createdAt
}: BookingFooterInfoProps) => {
  if (isCancelled && refundPercentage !== null) {
    return <RefundBadge percentage={refundPercentage} />
  }

  return (
    <p className="text-xs text-muted-foreground">
      Réservé le {formatDateFr(new Date(createdAt))}
    </p>
  )
}

export const BookingCard = ({
  booking,
  onCancel,
  showCancelButton = true,
  isHistory = false
}: BookingCardProps) => {
  const { court } = booking
  const displayStatus = getDisplayStatus(booking, isHistory)
  const isConfirmed = booking.status === 'confirmed'
  const isCancelled = booking.status === 'cancelled'
  const isInProgress = displayStatus === 'in-progress'
  const showCancel = showCancelButton && isConfirmed && !isHistory
  const refundPercentage = getRefundPercentage(booking)

  return (
    <article className="group relative overflow-hidden rounded-xl border-2 border-primary/25 bg-gradient-to-br from-primary/10 via-white to-white shadow-sm transition-shadow hover:shadow-md">
      <div
        className="pointer-events-none absolute -right-6 -bottom-6 size-32 opacity-10 transition-opacity group-hover:opacity-15"
        aria-hidden="true"
      >
        <img
          src="/images/tennis-ball.svg"
          alt=""
          width={128}
          height={128}
          className="size-full"
          loading="lazy"
        />
      </div>
      <div className="relative flex flex-col gap-4 p-5">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold leading-tight text-foreground">
              {court.name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <TimerIcon className="size-3.5 shrink-0" aria-hidden="true" />
                <span>{court.duration} min</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPinIcon className="size-3.5 shrink-0" aria-hidden="true" />
                <span>{getLocationLabel(court.location)}</span>
              </span>
            </div>
          </div>
          <Status status={displayStatus} className="shrink-0">
            <StatusIndicator />
            <StatusLabel />
          </Status>
        </header>
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CalendarIcon className="size-4" aria-hidden="true" />
            </div>
            <span className="font-semibold capitalize text-foreground">
              {formatDateWithDayFr(new Date(booking.startAt))}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-3 py-2">
              <ClockIcon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="whitespace-nowrap text-sm font-medium">
                {formatTimeFr(new Date(booking.startAt))} -{' '}
                {formatTimeFr(new Date(booking.endAt))}
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-3 py-2">
              <UsersIcon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="whitespace-nowrap text-sm font-medium">
                {court.capacity} joueurs
              </span>
            </div>
          </div>
        </div>
        <footer className="flex items-center justify-between border-t border-primary/15 pt-3">
          <div className="flex items-center gap-3">
            <p className="text-xl font-bold tabular-nums text-primary">
              {formatCentsToEuros(booking.price)}
            </p>
            {booking.paymentType !== 'free' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {booking.paymentType === 'credit' ? (
                  <>
                    <WalletIcon className="size-3.5" aria-hidden="true" />
                    Crédits
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="size-3.5" aria-hidden="true" />
                    Carte
                  </>
                )}
              </span>
            ) : null}
          </div>
          <BookingFooterInfo
            isCancelled={isCancelled}
            refundPercentage={refundPercentage}
            createdAt={booking.createdAt}
          />
        </footer>
        {showCancel ? (
          <div className="pt-1">
            {isInProgress ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-muted-foreground/30 bg-muted/50 text-muted-foreground"
                      disabled
                      aria-disabled="true"
                    >
                      <XIcon className="size-4" aria-hidden="true" />
                      Annuler la réservation
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Réservation en cours</TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-red-300 bg-red-50 text-red-700 hover:border-red-400 hover:bg-red-100 hover:text-red-800"
                onClick={() => {
                  return onCancel?.(booking.id)
                }}
              >
                <XIcon className="size-4" aria-hidden="true" />
                Annuler la réservation
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </article>
  )
}

export const BookingCardSkeleton = () => {
  return (
    <article className="overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-white shadow-sm">
      <div className="relative flex flex-col gap-4 p-5">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
        </header>
        <div className="space-y-2">
          <Skeleton className="h-14 w-full rounded-lg" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-primary/10 pt-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </article>
  )
}
