import type { VariantProps } from 'class-variance-authority'
import type { badgeVariants } from '@/components/ui/badge'
import { FULL_REFUND_HOURS_LIMIT, MS_PER_HOUR } from '@/constants/booking'
import type { Booking } from '@/constants/types'
import { nowParis } from '@/helpers/date'

export function matchIsFullRefund(startAt: Date) {
  const hoursUntilBooking =
    (startAt.getTime() - nowParis().getTime()) / MS_PER_HOUR

  return hoursUntilBooking >= FULL_REFUND_HOURS_LIMIT
}

type BookingTimeRange = Pick<Booking, 'startAt' | 'endAt'>

export function matchIsBookingInProgress(booking: BookingTimeRange) {
  const now = nowParis().getTime()
  const start = new Date(booking.startAt).getTime()
  const end = new Date(booking.endAt).getTime()

  return start <= now && now < end
}

type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

const STATUS_BADGES = {
  pending: { label: 'En attente', variant: 'secondary' },
  confirmed: { label: 'Confirmée', variant: 'default' },
  completed: { label: 'Terminée', variant: 'outline' },
  cancelled: { label: 'Annulée', variant: 'destructive' },
  expired: { label: 'Expirée', variant: 'outline' }
} as const satisfies Record<
  Booking['status'],
  { label: string; variant: BadgeVariant }
>

export function getBookingStatusBadge(status: Booking['status']) {
  return STATUS_BADGES[status]
}
