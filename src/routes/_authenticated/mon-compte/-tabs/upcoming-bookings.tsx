import React from 'react'
import { AlertCircleIcon, CalendarIcon } from 'lucide-react'
import { AnimatedNotification } from '@/components/animated-notification'
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
  getBookingHistoryQueryOpts,
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

const SUCCESS_NOTIFICATION_DURATION_MS = 5000

type CancelDescriptionProps = {
  booking: (Booking & { court: { name: string; duration: number } }) | undefined
}

const CancelDescription = ({ booking }: CancelDescriptionProps) => {
  if (!booking) {
    return <>Souhaitez-vous continuer ?</>
  }

  const isFullRefund = matchIsFullRefund(new Date(booking.startAt))

  return (
    <div className="space-y-3">
      <p>
        Vous êtes sur le point d&apos;annuler votre réservation du{' '}
        <span className="font-medium">
          {formatDateFr(new Date(booking.startAt))}
        </span>{' '}
        à{' '}
        <span className="font-medium">
          {formatTimeFr(new Date(booking.startAt))}
        </span>
        .
      </p>
      {isFullRefund ? (
        <p className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-700">
          Bonne nouvelle : vous serez remboursé{' '}
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
      <p className="text-muted-foreground">Souhaitez-vous continuer ?</p>
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

type CancelledBookingInfo = {
  courtName: string
  date: string
  time: string
  isFullRefund: boolean
}

export const UpcomingBookingsTab = () => {
  const queryClient = useQueryClient()
  const upcomingBookingsQuery = useSuspenseQuery(getUpcomingBookingsQueryOpts())
  const activeCountQuery = useSuspenseQuery(getActiveBookingCountQueryOpts())
  const [cancelingId, setCancelingId] = React.useState<Booking['id'] | null>(
    null
  )
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [cancelledBookingInfo, setCancelledBookingInfo] =
    React.useState<CancelledBookingInfo | null>(null)

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => {
      return cancelBookingFn({ data: { bookingId } })
    },
    onSuccess: (_data, bookingId) => {
      const cancelledBooking = upcomingBookingsQuery.data.find((booking) => {
        return booking.id === bookingId
      })

      if (cancelledBooking) {
        setCancelledBookingInfo({
          courtName: cancelledBooking.court.name,
          date: formatDateFr(new Date(cancelledBooking.startAt)),
          time: formatTimeFr(new Date(cancelledBooking.startAt)),
          isFullRefund: matchIsFullRefund(new Date(cancelledBooking.startAt))
        })
      }

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, SUCCESS_NOTIFICATION_DURATION_MS)

      queryClient.invalidateQueries(getUpcomingBookingsQueryOpts())
      queryClient.invalidateQueries(getActiveBookingCountQueryOpts())
      queryClient.invalidateQueries(getBookingHistoryQueryOpts())
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
        <AnimatedNotification show={showSuccess} variant="success">
          {cancelledBookingInfo ? (
            <span>
              Réservation du terrain {cancelledBookingInfo.courtName} le{' '}
              {cancelledBookingInfo.date} à {cancelledBookingInfo.time} annulée.
              Remboursement{' '}
              {cancelledBookingInfo.isFullRefund ? 'intégral' : 'à 50%'}{' '}
              effectué.{' '}
              <Link
                to="/mon-compte"
                search={{ tab: 'historique' }}
                className="font-medium underline underline-offset-2"
              >
                Voir l&apos;historique
              </Link>
            </span>
          ) : (
            <span>Réservation annulée avec succès.</span>
          )}
        </AnimatedNotification>
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
          <div className="grid gap-4 md:grid-cols-2">
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
            <AlertDialogDescription asChild>
              <div>
                <CancelDescription booking={bookingToCancel} />
              </div>
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
