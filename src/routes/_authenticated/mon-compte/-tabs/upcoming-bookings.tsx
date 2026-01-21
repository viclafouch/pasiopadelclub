import React from 'react'
import { AlertCircleIcon, CalendarIcon } from 'lucide-react'
import { BookingCard } from '@/components/booking-card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { MAX_ACTIVE_BOOKINGS } from '@/constants/booking'
import {
  getActiveBookingCountQueryOpts,
  getUpcomingBookingsQueryOpts
} from '@/constants/queries'
import type { Booking } from '@/constants/types'
import { formatDateFr, formatTimeFr } from '@/helpers/date'
import { getErrorMessage } from '@/helpers/error'
import { cancelBookingFn } from '@/server/bookings'
import { matchIsFullRefund } from '@/utils/booking'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

type CancelDescriptionProps = {
  booking: (Booking & { court: { name: string; duration: number } }) | undefined
}

const CancelDescription = ({ booking }: CancelDescriptionProps) => {
  if (!booking) {
    return <>Voulez-vous vraiment annuler cette réservation ?</>
  }

  const isFullRefund = matchIsFullRefund(new Date(booking.startAt))

  return (
    <div className="space-y-3">
      <p>
        Voulez-vous vraiment annuler votre réservation du{' '}
        <span className="font-medium">
          {formatDateFr(new Date(booking.startAt))}
        </span>{' '}
        à{' '}
        <span className="font-medium">
          {formatTimeFr(new Date(booking.startAt))}
        </span>{' '}
        ?
      </p>
      {isFullRefund ? (
        <p className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-700">
          Vous serez remboursé{' '}
          <span className="font-semibold">intégralement</span> car
          l&apos;annulation intervient plus de 24h avant le créneau.
        </p>
      ) : (
        <p className="rounded-md bg-amber-500/10 p-3 text-sm text-amber-700">
          Vous serez remboursé à hauteur de{' '}
          <span className="font-semibold">50%</span> car l&apos;annulation
          intervient moins de 24h avant le créneau.
        </p>
      )}
    </div>
  )
}

const EmptyBookings = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
      <CalendarIcon
        className="size-12 text-muted-foreground"
        aria-hidden="true"
      />
      <div className="space-y-2">
        <h3 className="font-display text-lg font-semibold">
          Aucune réservation
        </h3>
        <p className="text-muted-foreground">
          Vous n&apos;avez pas de réservation à venir.
        </p>
      </div>
      <Button asChild>
        <Link to="/reservation">Réserver un terrain</Link>
      </Button>
    </div>
  )
}

export const UpcomingBookingsTab = () => {
  const queryClient = useQueryClient()
  const upcomingBookingsQuery = useSuspenseQuery(getUpcomingBookingsQueryOpts())
  const activeCountQuery = useSuspenseQuery(getActiveBookingCountQueryOpts())
  const [cancelingId, setCancelingId] = React.useState<Booking['id'] | null>(
    null
  )
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => {
      return cancelBookingFn({ data: { bookingId } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(getUpcomingBookingsQueryOpts())
      queryClient.invalidateQueries(getActiveBookingCountQueryOpts())
    },
    onSettled: () => {
      setIsDialogOpen(false)
      setCancelingId(null)
    }
  })

  const handleCancelClick = (bookingId: Booking['id']) => {
    setCancelingId(bookingId)
    setIsDialogOpen(true)
  }

  const handleConfirmCancel = () => {
    if (!cancelingId) {
      return
    }

    cancelBookingMutation.mutate(cancelingId)
  }

  const bookingToCancel = upcomingBookingsQuery.data.find((booking) => {
    return booking.id === cancelingId
  })

  const isLimitReached = activeCountQuery.data >= MAX_ACTIVE_BOOKINGS

  return (
    <>
      <div className="space-y-6">
        {isLimitReached ? (
          <div className="flex items-center gap-3 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
            <AlertCircleIcon
              className="size-5 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <p className="text-sm text-amber-700">
              Vous avez atteint la limite de {MAX_ACTIVE_BOOKINGS} réservations
              actives. Annulez une réservation pour en effectuer une nouvelle.
            </p>
          </div>
        ) : null}
        {upcomingBookingsQuery.data.length === 0 ? (
          <EmptyBookings />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {upcomingBookingsQuery.data.map((booking) => {
              return (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancelClick}
                />
              )
            })}
          </div>
        )}
      </div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la réservation</AlertDialogTitle>
            <AlertDialogDescription>
              <CancelDescription booking={bookingToCancel} />
            </AlertDialogDescription>
          </AlertDialogHeader>
          {cancelBookingMutation.isError ? (
            <p role="alert" className="text-sm text-destructive">
              {getErrorMessage(cancelBookingMutation.error)}
            </p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelBookingMutation.isPending}>
              Non, garder
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={cancelBookingMutation.isPending}
              aria-busy={cancelBookingMutation.isPending}
            >
              {cancelBookingMutation.isPending
                ? 'Annulation...'
                : 'Oui, annuler'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
