import React from 'react'
import type { FunctionReturnType } from 'convex/server'
import { HistoryIcon, LoaderIcon } from 'lucide-react'
import { BookingCard } from '@/components/booking-card'
import { Button } from '@/components/ui/button'
import { api } from '~/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'

type PastBookingsResult = FunctionReturnType<typeof api.bookings.getPast>
type BookingWithCourt = PastBookingsResult['bookings'][number]

const PAGE_SIZE = 20

export const HistoryTab = () => {
  const [loadedBookings, setLoadedBookings] = React.useState<
    BookingWithCourt[]
  >([])
  const [nextCursor, setNextCursor] = React.useState<string | null>(null)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)

  const initialQuery = useSuspenseQuery(
    convexQuery(api.bookings.getPast, { limit: PAGE_SIZE })
  )

  const loadMoreQuery = useQuery({
    ...convexQuery(api.bookings.getPast, {
      limit: PAGE_SIZE,
      cursor: nextCursor ?? ''
    }),
    enabled: isLoadingMore && nextCursor !== null
  })

  React.useEffect(() => {
    if (loadMoreQuery.data && isLoadingMore) {
      setLoadedBookings((previous) => {
        return [...previous, ...loadMoreQuery.data.bookings]
      })
      setNextCursor(loadMoreQuery.data.nextCursor)
      setIsLoadingMore(false)
    }
  }, [loadMoreQuery.data, isLoadingMore])

  const displayBookings =
    loadedBookings.length > 0
      ? [...initialQuery.data.bookings, ...loadedBookings]
      : initialQuery.data.bookings

  const hasMoreToLoad =
    loadedBookings.length > 0
      ? nextCursor !== null
      : initialQuery.data.nextCursor !== null

  const handleLoadMore = () => {
    const cursor =
      loadedBookings.length > 0 ? nextCursor : initialQuery.data.nextCursor

    if (cursor) {
      setNextCursor(cursor)
      setIsLoadingMore(true)
    }
  }

  if (displayBookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <HistoryIcon
          className="size-12 text-muted-foreground"
          aria-hidden="true"
        />
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Aucun historique</h3>
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
        {displayBookings.map((booking) => {
          return (
            <BookingCard
              key={booking._id}
              booking={booking}
              showCancelButton={false}
            />
          )
        })}
      </div>
      {hasMoreToLoad ? (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loadMoreQuery.isFetching}
            aria-busy={loadMoreQuery.isFetching}
          >
            {loadMoreQuery.isFetching ? (
              <>
                <LoaderIcon
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
                Chargement...
              </>
            ) : (
              'Charger plus'
            )}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
