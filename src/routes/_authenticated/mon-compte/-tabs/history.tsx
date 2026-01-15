import { HistoryIcon } from 'lucide-react'
import { BookingCard } from '@/components/booking-card'
import { getBookingHistoryQueryOpts } from '@/constants/queries'
import { useSuspenseQuery } from '@tanstack/react-query'

export const HistoryTab = () => {
  const historyQuery = useSuspenseQuery(getBookingHistoryQueryOpts())

  const allBookings = historyQuery.data

  if (allBookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
        <HistoryIcon
          className="size-12 text-muted-foreground"
          aria-hidden="true"
        />
        <div className="space-y-2">
          <h3 className="font-display text-lg font-semibold">
            Aucun historique
          </h3>
          <p className="text-muted-foreground">
            Vos réservations passées apparaîtront ici.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {allBookings.map((booking) => {
          return (
            <BookingCard
              key={booking.id}
              booking={booking}
              showCancelButton={false}
            />
          )
        })}
      </div>
    </div>
  )
}
