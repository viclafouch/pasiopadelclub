import React from 'react'
import { useConvex } from 'convex/react'
import { HistoryIcon, LoaderIcon } from 'lucide-react'
import { BookingCard } from '@/components/booking-card'
import { Button } from '@/components/ui/button'
import { api } from '~/convex/_generated/api'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

const PAGE_SIZE = 20

export const HistoryTab = () => {
  const convex = useConvex()

  const historyQuery = useSuspenseInfiniteQuery({
    queryKey: ['bookings', 'past'],
    queryFn: async ({ pageParam }) => {
      return convex.query(api.bookings.getPast, {
        limit: PAGE_SIZE,
        cursor: pageParam
      })
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined
    }
  })

  const allBookings = historyQuery.data.pages.flatMap((page) => {
    return page.bookings
  })

  if (allBookings.length === 0) {
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
        {allBookings.map((booking) => {
          return (
            <BookingCard
              key={booking._id}
              booking={booking}
              showCancelButton={false}
            />
          )
        })}
      </div>
      {historyQuery.hasNextPage ? (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              return historyQuery.fetchNextPage()
            }}
            disabled={historyQuery.isFetchingNextPage}
            aria-busy={historyQuery.isFetchingNextPage}
          >
            {historyQuery.isFetchingNextPage ? (
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
