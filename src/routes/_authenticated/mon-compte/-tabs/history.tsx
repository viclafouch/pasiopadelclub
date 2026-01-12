import { HistoryIcon } from 'lucide-react'
import { BookingCard } from '@/components/booking-card'
import { api } from '~/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'

export const HistoryTab = () => {
  const pastBookingsQuery = useSuspenseQuery(
    convexQuery(api.bookings.getPast, { limit: 20 })
  )

  if (pastBookingsQuery.data.bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <HistoryIcon className="size-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">Aucun historique</h3>
        <p className="text-muted-foreground">
          Vos réservations passées apparaîtront ici.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {pastBookingsQuery.data.bookings.map((booking) => {
        return (
          <BookingCard
            key={booking._id}
            booking={booking}
            showCancelButton={false}
          />
        )
      })}
    </div>
  )
}
