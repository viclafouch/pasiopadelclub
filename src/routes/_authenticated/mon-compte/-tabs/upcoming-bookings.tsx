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
import { matchCanCancelBooking } from '@/utils/booking'
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

  return (
    <>
      Voulez-vous vraiment annuler votre réservation du{' '}
      <span className="font-medium">
        {formatDateFr(new Date(booking.startAt))}
      </span>{' '}
      à{' '}
      <span className="font-medium">
        {formatTimeFr(new Date(booking.startAt))}
      </span>{' '}
      ? Vous serez remboursé intégralement.
    </>
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
  const canCancelBooking = bookingToCancel
    ? matchCanCancelBooking(bookingToCancel.startAt)
    : false

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
            <AlertDialogTitle>
              {canCancelBooking
                ? 'Annuler la réservation'
                : 'Annulation impossible'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {canCancelBooking ? (
                <CancelDescription booking={bookingToCancel} />
              ) : (
                <>
                  Les réservations ne peuvent être annulées moins de 24 heures
                  avant le créneau prévu. Cette règle nous permet de garantir la
                  disponibilité des terrains pour tous nos joueurs.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {cancelBookingMutation.isError ? (
            <p role="alert" className="text-sm text-destructive">
              {getErrorMessage(cancelBookingMutation.error)}
            </p>
          ) : null}
          <AlertDialogFooter>
            {canCancelBooking ? (
              <>
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
              </>
            ) : (
              <AlertDialogCancel>Compris</AlertDialogCancel>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
