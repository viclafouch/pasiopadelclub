import React from 'react'
import { useConvexAuth } from 'convex/react'
import { CalendarIcon } from 'lucide-react'
import { z } from 'zod'
import { MAX_ACTIVE_BOOKINGS } from '@/constants/booking'
import type { Court, SelectedSlot, Slot } from '@/constants/types'
import { getTodayDateKey } from '@/helpers/date'
import { seo } from '@/utils/seo'
import { api } from '~/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import {
  useQuery,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { BookingSummaryModal } from './-components/booking-summary-modal'
import { CourtTypeGroup } from './-components/court-type-group'
import { DaySelector } from './-components/day-selector'
import { LimitBanner } from './-components/limit-banner'
import { LimitReachedDialog } from './-components/limit-reached-dialog'
import { ReservationPageSkeleton } from './-components/skeletons'

const searchSchema = z.object({
  date: z.string().optional()
})

const ReservationContent = () => {
  const { isAuthenticated } = useConvexAuth()
  const { date } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const queryClient = useQueryClient()

  const selectedDate = date ?? getTodayDateKey()

  const [selectedSlot, setSelectedSlot] = React.useState<SelectedSlot | null>(
    null
  )
  const [isLimitDialogOpen, setIsLimitDialogOpen] = React.useState(false)

  const activeCountQuery = useQuery({
    ...convexQuery(api.bookings.getActiveCount, {}),
    enabled: isAuthenticated
  })

  const slotsQuery = useSuspenseQuery(
    convexQuery(api.slots.getByDate, {
      date: selectedDate
    })
  )

  const handleDateChange = (newDate: string) => {
    navigate({
      search: (prev) => {
        return { ...prev, date: newDate }
      },
      replace: true,
      resetScroll: false
    })
  }

  const handleDateHover = (dateKey: string) => {
    queryClient.prefetchQuery(
      convexQuery(api.slots.getByDate, { date: dateKey })
    )
  }

  const handleSlotSelect = (court: Court, slot: Slot) => {
    if (!isAuthenticated) {
      const returnUrl = `/reservation?date=${selectedDate}`
      navigate({ to: '/connexion/$', search: { redirect: returnUrl } })

      return
    }

    const activeCount = activeCountQuery.data ?? 0

    if (activeCount >= MAX_ACTIVE_BOOKINGS) {
      setIsLimitDialogOpen(true)

      return
    }

    setSelectedSlot({ court, slot, dateKey: selectedDate })
  }

  const handleCloseModal = () => {
    setSelectedSlot(null)
  }

  const handleCloseLimitDialog = () => {
    setIsLimitDialogOpen(false)
  }

  const activeCount = activeCountQuery.data ?? 0
  const isAtLimit = isAuthenticated && activeCount >= MAX_ACTIVE_BOOKINGS
  const courtsWithSlots = slotsQuery.data

  const courtsByType = courtsWithSlots.reduce<
    Record<string, typeof courtsWithSlots>
  >((groups, courtWithSlots) => {
    const courtType = courtWithSlots.court.type
    const existing = groups[courtType] ?? []

    return { ...groups, [courtType]: [...existing, courtWithSlots] }
  }, {})

  const typeOrder = ['double', 'simple', 'kids'] as const

  return (
    <>
      <div className="space-y-6">
        {isAtLimit ? <LimitBanner maxCount={MAX_ACTIVE_BOOKINGS} /> : null}
        <div className="day-selector-sticky sticky top-[var(--navbar-height)] z-10 sm:mx-auto sm:w-fit sm:max-w-full">
          <div className="day-selector-inner rounded-b-md bg-background py-2">
            <DaySelector
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              onDateHover={handleDateHover}
            />
          </div>
        </div>
        {courtsWithSlots.length === 0 ? (
          <div className="rounded-lg border border-dashed border-muted-foreground/25 p-12 text-center">
            <CalendarIcon
              className="mx-auto size-12 text-muted-foreground/50"
              aria-hidden="true"
            />
            <h3 className="mt-4 font-semibold">Aucun terrain disponible</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Aucun terrain ne correspond aux filtres sélectionnés.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {typeOrder.map((courtType) => {
              const groupCourts = courtsByType[courtType]

              return groupCourts ? (
                <CourtTypeGroup
                  key={courtType}
                  type={courtType}
                  courtsWithSlots={groupCourts}
                  onSlotSelect={handleSlotSelect}
                />
              ) : null
            })}
          </div>
        )}
      </div>
      <BookingSummaryModal
        isOpen={selectedSlot !== null}
        onClose={handleCloseModal}
        selectedSlot={selectedSlot}
      />
      <LimitReachedDialog
        isOpen={isLimitDialogOpen}
        onClose={handleCloseLimitDialog}
      />
    </>
  )
}

const ReservationPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-muted/30 py-8">
        <div className="container">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Réserver un terrain
          </h1>
          <p className="mt-2 text-muted-foreground">
            Choisissez une date et un créneau pour réserver votre partie de
            padel.
          </p>
        </div>
      </section>
      <section className="py-6">
        <div className="container">
          <React.Suspense fallback={<ReservationPageSkeleton />}>
            <ReservationContent />
          </React.Suspense>
        </div>
      </section>
    </main>
  )
}

export const Route = createFileRoute('/_public__root/reservation/')({
  component: ReservationPage,
  validateSearch: searchSchema,
  head: () => {
    return {
      meta: seo({
        title: 'Réservation',
        description:
          'Réservez votre court de padel en ligne à Pasio Padel Club Anglet. Choisissez votre créneau parmi nos 6 terrains disponibles 7j/7.',
        pathname: '/reservation'
      })
    }
  }
})
