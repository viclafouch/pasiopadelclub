import React from 'react'
import { useMutation } from 'convex/react'
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
import type { BookingId } from '@/constants/types'
import { formatDateFr, formatTimeFr } from '@/helpers/date'
import { matchCanCancelBooking } from '@/utils/booking'
import { api } from '~/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

const MAX_ACTIVE_BOOKINGS = 2

const EmptyBookings = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <CalendarIcon className="size-12 text-muted-foreground mb-4" />
      <h3 className="font-semibold text-lg mb-2">Aucune réservation</h3>
      <p className="text-muted-foreground mb-4">
        Vous n&apos;avez pas de réservation à venir.
      </p>
      <Button asChild>
        <Link to="/reservation">Réserver un terrain</Link>
      </Button>
    </div>
  )
}

export const UpcomingBookingsTab = () => {
  const upcomingBookingsQuery = useSuspenseQuery(
    convexQuery(api.bookings.getUpcoming, {})
  )
  const activeCountQuery = useSuspenseQuery(
    convexQuery(api.bookings.getActiveCount, {})
  )
  const cancelBooking = useMutation(api.bookings.cancel)
  const [cancelingId, setCancelingId] = React.useState<BookingId | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const upcomingBookings = upcomingBookingsQuery.data
  const activeCount = activeCountQuery.data

  const handleCancelClick = (bookingId: BookingId) => {
    setCancelingId(bookingId)
    setIsDialogOpen(true)
  }

  const handleConfirmCancel = async () => {
    if (!cancelingId) {
      return
    }

    try {
      await cancelBooking({ bookingId: cancelingId })
      setIsDialogOpen(false)
      setCancelingId(null)
    } catch {
      setIsDialogOpen(false)
      setCancelingId(null)
    }
  }

  const bookingToCancel = upcomingBookings.find((booking) => {
    return booking._id === cancelingId
  })

  const isLimitReached = activeCount >= MAX_ACTIVE_BOOKINGS

  return (
    <>
      <div className="space-y-6">
        {isLimitReached ? (
          <div className="flex items-center gap-3 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
            <AlertCircleIcon className="size-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-700">
              Vous avez atteint la limite de {MAX_ACTIVE_BOOKINGS} réservations
              actives. Annulez une réservation pour en effectuer une nouvelle.
            </p>
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Réservations actives :{' '}
            <span className="font-medium text-foreground">
              {activeCount}/{MAX_ACTIVE_BOOKINGS}
            </span>
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/reservation">Nouvelle réservation</Link>
          </Button>
        </div>
        {upcomingBookings.length === 0 ? (
          <EmptyBookings />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {upcomingBookings.map((booking) => {
              return (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={handleCancelClick}
                  canCancel={matchCanCancelBooking(booking.startAt)}
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
              {bookingToCancel ? (
                <>
                  Voulez-vous vraiment annuler votre réservation du{' '}
                  <span className="font-medium">
                    {formatDateFr(new Date(bookingToCancel.startAt))}
                  </span>{' '}
                  à{' '}
                  <span className="font-medium">
                    {formatTimeFr(new Date(bookingToCancel.startAt))}
                  </span>{' '}
                  ? Vous serez remboursé intégralement.
                </>
              ) : (
                'Voulez-vous vraiment annuler cette réservation ?'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Non, garder</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>
              Oui, annuler
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
