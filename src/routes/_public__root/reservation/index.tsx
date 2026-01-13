import React from 'react'
import { CalendarIcon } from 'lucide-react'
import { z } from 'zod'
import { Skeleton } from '@/components/ui/skeleton'
import { MAX_ACTIVE_BOOKINGS } from '@/constants/booking'
import type { CourtTypeFilter, LocationFilter } from '@/constants/court'
import { getTodayDateKey } from '@/helpers/date'
import { seo } from '@/utils/seo'
import { api } from '~/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  useNavigate,
  useRouteContext
} from '@tanstack/react-router'
import { DaySelector } from './-components/day-selector'
import { FilterBar } from './-components/filter-bar'
import { FilterDrawer } from './-components/filter-drawer'
import { LimitBanner } from './-components/limit-banner'

const searchSchema = z.object({
  date: z.string().optional(),
  type: z.enum(['all', 'double', 'simple', 'kids']).optional(),
  location: z.enum(['all', 'indoor', 'outdoor']).optional()
})

type SearchParams = z.infer<typeof searchSchema>

const ReservationPageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-hidden py-2">
        {Array.from({ length: 7 }).map((_, index) => {
          return (
            <Skeleton key={index} className="h-16 w-20 shrink-0 rounded-xl" />
          )
        })}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => {
          return <Skeleton key={index} className="h-32 rounded-lg" />
        })}
      </div>
    </div>
  )
}

const ReservationContent = () => {
  const { authState } = useRouteContext({ from: '__root__' })
  const { date, type = 'all', location = 'all' } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const isAuthenticated = authState?.isAuthenticated ?? false

  const selectedDate = date ?? getTodayDateKey()

  const activeCountQuery = useQuery({
    ...convexQuery(api.bookings.getActiveCount, {}),
    enabled: isAuthenticated
  })

  const updateSearch = (updates: Partial<SearchParams>) => {
    navigate({
      search: (prev) => {
        return { ...prev, ...updates }
      },
      replace: true
    })
  }

  const handleDateChange = (newDate: string) => {
    updateSearch({ date: newDate })
  }

  const handleCourtTypeChange = (newType: CourtTypeFilter) => {
    updateSearch({ type: newType === 'all' ? undefined : newType })
  }

  const handleLocationChange = (newLocation: LocationFilter) => {
    updateSearch({ location: newLocation === 'all' ? undefined : newLocation })
  }

  const activeCount = activeCountQuery.data ?? 0
  const isAtLimit = isAuthenticated && activeCount >= MAX_ACTIVE_BOOKINGS

  return (
    <div className="space-y-6">
      {isAtLimit ? <LimitBanner maxCount={MAX_ACTIVE_BOOKINGS} /> : null}
      <DaySelector
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
      <div className="flex items-center gap-4">
        <FilterBar
          courtType={type}
          location={location}
          onCourtTypeChange={handleCourtTypeChange}
          onLocationChange={handleLocationChange}
        />
        <FilterDrawer
          courtType={type}
          location={location}
          onCourtTypeChange={handleCourtTypeChange}
          onLocationChange={handleLocationChange}
        />
      </div>
      <div className="rounded-lg border border-dashed border-muted-foreground/25 p-12 text-center">
        <CalendarIcon
          className="mx-auto size-12 text-muted-foreground/50"
          aria-hidden="true"
        />
        <h3 className="mt-4 font-semibold">Créneaux disponibles</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Les créneaux disponibles apparaîtront ici.
        </p>
      </div>
    </div>
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
