import type { VariantProps } from 'class-variance-authority'
import type { badgeVariants } from '@/components/ui/badge'
import type { Booking } from '@/constants/types'

const MS_PER_HOUR = 1000 * 60 * 60
const CANCELLATION_HOURS_LIMIT = 24

export const matchCanCancelBooking = (startAt: Date) => {
  const hoursUntilBooking = (startAt.getTime() - Date.now()) / MS_PER_HOUR

  return hoursUntilBooking >= CANCELLATION_HOURS_LIMIT
}

type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

const STATUS_BADGES = {
  pending: { label: 'En attente', variant: 'secondary' },
  confirmed: { label: 'Confirmée', variant: 'default' },
  completed: { label: 'Terminée', variant: 'outline' },
  cancelled: { label: 'Annulée', variant: 'destructive' },
  expired: { label: 'Expirée', variant: 'outline' }
} satisfies Record<Booking['status'], { label: string; variant: BadgeVariant }>

export const getBookingStatusBadge = (status: Booking['status']) => {
  return STATUS_BADGES[status]
}
