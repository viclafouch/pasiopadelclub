import React from 'react'
import { CalendarIcon } from 'lucide-react'
import { AnimatedNotification } from '@/components/animated-notification'
import { BookingCard } from '@/components/booking-card'
import { Button } from '@/components/ui/button'
import { getUpcomingBookingsQueryOpts } from '@/constants/queries'
import { formatDateFr, formatTimeFr } from '@/helpers/date'
import {
  CancelBookingDialog,
  type CancelDialogData
} from '@/routes/_authenticated/mon-compte/-components/cancel-booking-dialog'
import { matchIsFullRefund } from '@/utils/booking'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

const SUCCESS_NOTIFICATION_DURATION_MS = 5000

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
  const upcomingBookingsQuery = useSuspenseQuery(getUpcomingBookingsQueryOpts())

  const [cancelDialogData, setCancelDialogData] =
    React.useState<CancelDialogData | null>(null)
  const [cancelledInfo, setCancelledInfo] =
    React.useState<CancelDialogData | null>(null)

  const handleCancelClick = (bookingId: string) => {
    const booking = upcomingBookingsQuery.data.find((item) => {
      return item.id === bookingId
    })

    if (booking) {
      setCancelDialogData({
        bookingId: booking.id,
        courtName: booking.court.name,
        date: formatDateFr(new Date(booking.startAt)),
        time: formatTimeFr(new Date(booking.startAt)),
        isFullRefund: matchIsFullRefund(new Date(booking.startAt))
      })
    }
  }

  const handleCancelSuccess = (data: CancelDialogData) => {
    setCancelledInfo(data)

    setTimeout(() => {
      setCancelledInfo(null)
    }, SUCCESS_NOTIFICATION_DURATION_MS)
  }

  return (
    <>
      <div className="space-y-6">
        <AnimatedNotification show={cancelledInfo !== null} variant="success">
          {cancelledInfo ? (
            <span>
              Réservation du terrain {cancelledInfo.courtName} le{' '}
              {cancelledInfo.date} à {cancelledInfo.time} annulée. Remboursement{' '}
              {cancelledInfo.isFullRefund ? 'intégral' : 'à 50%'} effectué.{' '}
              <Link
                to="/mon-compte"
                search={{ tab: 'historique' }}
                className="font-medium underline underline-offset-2"
              >
                Voir l&apos;historique
              </Link>
            </span>
          ) : null}
        </AnimatedNotification>
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
      {cancelDialogData ? (
        <CancelBookingDialog
          data={cancelDialogData}
          onClose={() => {
            setCancelDialogData(null)
          }}
          onSuccess={handleCancelSuccess}
        />
      ) : null}
    </>
  )
}
