import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Booking, BookingWithCourt } from '@/constants/types'
import { formatDateFr, formatTimeFr } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
import { getBookingStatusBadge } from '@/utils/booking'
import { getCourtTypeLabel, getLocationLabel } from '@/utils/court'

type BookingCardProps = {
  booking: BookingWithCourt
  onCancel?: (bookingId: Booking['id']) => void
  showCancelButton?: boolean
}

export const BookingCard = ({
  booking,
  onCancel,
  showCancelButton = true
}: BookingCardProps) => {
  const statusBadge = getBookingStatusBadge(booking.status)
  const { court } = booking
  const isConfirmed = booking.status === 'confirmed'
  const showCancel = showCancelButton && isConfirmed

  const handleCancel = () => {
    onCancel?.(booking.id)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-lg">
              Terrain {court.name}
            </h3>
            <p className="text-muted-foreground text-sm">
              {getCourtTypeLabel(court.type)}
            </p>
          </div>
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="size-4" aria-hidden="true" />
            <span>{formatDateFr(new Date(booking.startAt))}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ClockIcon className="size-4" aria-hidden="true" />
            <span>
              {formatTimeFr(new Date(booking.startAt))} -{' '}
              {formatTimeFr(new Date(booking.endAt))}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPinIcon className="size-4" aria-hidden="true" />
            <span>{getLocationLabel(court.location)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <UsersIcon className="size-4" aria-hidden="true" />
            <span>{court.capacity} joueurs</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <p className="font-medium">{formatCentsToEuros(booking.price)}</p>
          <p className="text-xs text-muted-foreground">
            Réservé le {formatDateFr(new Date(booking.createdAt))}
          </p>
        </div>
      </CardContent>
      {showCancel ? (
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={handleCancel}>
            Annuler la réservation
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  )
}

export const BookingCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="pt-2 border-t">
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}
