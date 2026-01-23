import React from 'react'
import { CalendarIcon } from 'lucide-react'
import { z } from 'zod'
import {
  CLOSING_HOUR,
  DAYS_TO_SHOW,
  MIN_SESSION_MINUTES
} from '@/constants/booking'
import {
  type AvailabilityFilter,
  COURT_TYPE_ORDER,
  type CourtTypeFilter,
  type LocationFilter
} from '@/constants/court'
import {
  getSlotsByDateQueryOpts,
  getUpcomingBookingsQueryOpts
} from '@/constants/queries'
import { SECOND } from '@/constants/time'
import type { Court, SelectedSlot, Slot } from '@/constants/types'
import { filterCourts } from '@/helpers/court-filters'
import { getValidBookingDateKey } from '@/helpers/date'
import { seo } from '@/utils/seo'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import {
  ClientOnly,
  createFileRoute,
  useNavigate,
  useRouteContext
} from '@tanstack/react-router'
import { BookingModal } from './-components/booking-modal'
import { CourtTypeGroup } from './-components/court-type-group'
import { DaySelector } from './-components/day-selector'
import { FilterBar } from './-components/filter-bar'
import { FilterDrawer } from './-components/filter-drawer'
import { NextBookingBadge } from './-components/next-booking-badge'
import { SlotsSkeleton } from './-components/skeletons'

const searchSchema = z.object({
  date: z.string().optional(),
  type: z.enum(['all', 'double', 'simple', 'kids']).optional().catch('all'),
  location: z.enum(['all', 'indoor', 'outdoor']).optional().catch('all'),
  available: z.enum(['all', 'available']).optional().catch('all')
})

type SlotsContentProps = {
  selectedDate: string
  courtType: CourtTypeFilter
  location: LocationFilter
  availability: AvailabilityFilter
  onSlotSelect: (court: Court, slot: Slot) => void
}

const SlotsContent = ({
  selectedDate,
  courtType,
  location,
  availability,
  onSlotSelect
}: SlotsContentProps) => {
  const slotsQuery = useSuspenseQuery(getSlotsByDateQueryOpts(selectedDate))

  const filteredCourts = filterCourts({
    courts: slotsQuery.data,
    courtType,
    location,
    availability
  })

  const groupedByType = Map.groupBy(filteredCourts, (item) => {
    return item.court.type
  })

  const courtGroups = COURT_TYPE_ORDER.map((type) => {
    return {
      type,
      courts: groupedByType.get(type) ?? []
    }
  }).filter((group) => {
    return group.courts.length > 0
  })

  return (
    <>
      {courtGroups.length === 0 ? (
        <div className="mx-4 rounded-lg border border-dashed border-muted-foreground/25 p-12 text-center sm:mx-0">
          <CalendarIcon
            className="mx-auto size-12 text-muted-foreground/50"
            aria-hidden="true"
          />
          <h3 className="mt-4 font-display font-semibold">
            Aucun terrain disponible
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Aucun terrain ne correspond aux filtres sélectionnés.
          </p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {courtGroups.map((group) => {
            return (
              <CourtTypeGroup
                key={group.type}
                type={group.type}
                courtsWithSlots={group.courts}
                onSlotSelect={onSlotSelect}
              />
            )
          })}
        </div>
      )}
    </>
  )
}

const ReservationContent = () => {
  const { user } = useRouteContext({ from: '__root__' })
  const { date, type, location, available } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const queryClient = useQueryClient()
  const [selectedSlot, setSelectedSlot] = React.useState<SelectedSlot | null>(
    null
  )

  const isAuthenticated = Boolean(user)
  const selectedDate = getValidBookingDateKey({
    maxDays: DAYS_TO_SHOW,
    closingHour: CLOSING_HOUR,
    minSessionMinutes: MIN_SESSION_MINUTES,
    urlDate: date
  })

  const courtType = type ?? 'all'
  const locationFilter = location ?? 'all'
  const availabilityFilter = available ?? 'all'

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
    queryClient.prefetchQuery(getSlotsByDateQueryOpts(dateKey))
  }

  const handleCourtTypeChange = (newType: CourtTypeFilter) => {
    navigate({
      search: (prev) => {
        return {
          ...prev,
          type: newType === 'all' ? undefined : newType
        }
      },
      replace: true,
      resetScroll: false
    })
  }

  const handleLocationChange = (newLocation: LocationFilter) => {
    navigate({
      search: (prev) => {
        return {
          ...prev,
          location: newLocation === 'all' ? undefined : newLocation
        }
      },
      replace: true,
      resetScroll: false
    })
  }

  const handleAvailabilityChange = (newAvailability: AvailabilityFilter) => {
    navigate({
      search: (prev) => {
        return {
          ...prev,
          available: newAvailability === 'all' ? undefined : newAvailability
        }
      },
      replace: true,
      resetScroll: false
    })
  }

  const handleSlotSelect = (court: Court, slot: Slot) => {
    if (!isAuthenticated) {
      navigate({ to: '/connexion', search: { redirect: '/reservation' } })

      return
    }

    setSelectedSlot({ court, slot, dateKey: selectedDate })
  }

  const handleCloseModal = () => {
    setSelectedSlot(null)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="day-selector-sticky sticky top-[var(--navbar-height)] z-10 flex justify-center">
          <div className="day-selector-inner w-full max-w-fit bg-background py-2 sm:rounded-b-md">
            <DaySelector
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              onDateHover={handleDateHover}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-y-4 px-4 sm:container sm:px-8">
            <div className="flex min-h-14 items-center justify-between gap-4">
              <FilterBar
                courtType={courtType}
                location={locationFilter}
                availability={availabilityFilter}
                onCourtTypeChange={handleCourtTypeChange}
                onLocationChange={handleLocationChange}
                onAvailabilityChange={handleAvailabilityChange}
              />
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <ClientOnly>
                    <div className="hidden h-14 items-center sm:flex">
                      <NextBookingBadge />
                    </div>
                  </ClientOnly>
                ) : null}
                <FilterDrawer
                  courtType={courtType}
                  location={locationFilter}
                  availability={availabilityFilter}
                  onCourtTypeChange={handleCourtTypeChange}
                  onLocationChange={handleLocationChange}
                  onAvailabilityChange={handleAvailabilityChange}
                />
              </div>
            </div>
          </div>
          <div className="sm:container">
            <React.Suspense fallback={<SlotsSkeleton />}>
              <SlotsContent
                selectedDate={selectedDate}
                courtType={courtType}
                location={locationFilter}
                availability={availabilityFilter}
                onSlotSelect={handleSlotSelect}
              />
            </React.Suspense>
          </div>
        </div>
      </div>
      <ClientOnly>
        {selectedSlot !== null ? (
          <BookingModal
            key={selectedSlot.slot.startAt}
            onClose={handleCloseModal}
            selectedSlot={selectedSlot}
          />
        ) : null}
      </ClientOnly>
    </>
  )
}

const ReservationPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative flex h-[300px] items-center justify-center overflow-hidden">
        <picture>
          <source srcSet="/images/terrain.webp" type="image/webp" />
          <img
            src="/images/terrain.jpg"
            alt="Terrain de padel Pasio Padel Club Anglet"
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"
          aria-hidden="true"
        />
        <div className="container relative z-10 text-center">
          <h1 className="font-display text-4xl font-light tracking-tight text-white sm:text-5xl">
            Réserver un terrain
          </h1>
          <p className="mt-3 text-lg text-white/80">
            Choisissez une date et un créneau pour votre partie
          </p>
        </div>
      </section>
      <section className="section-pb">
        <ReservationContent />
      </section>
    </main>
  )
}

export const Route = createFileRoute('/_public__root/reservation/')({
  component: ReservationPage,
  validateSearch: searchSchema,
  beforeLoad: ({ context, search }) => {
    const selectedDate = getValidBookingDateKey({
      maxDays: DAYS_TO_SHOW,
      closingHour: CLOSING_HOUR,
      minSessionMinutes: MIN_SESSION_MINUTES,
      urlDate: search.date
    })
    context.queryClient.ensureQueryData(getSlotsByDateQueryOpts(selectedDate))
  },
  loader: async ({ context }) => {
    if (context.user) {
      context.queryClient.ensureQueryData(getUpcomingBookingsQueryOpts())
    }
  },
  staleTime: 30 * SECOND,
  head: () => {
    const seoData = seo({
      title: 'Réservation',
      description:
        'Réservez votre court de padel en ligne à Pasio Padel Club Bayonne. Choisissez votre créneau parmi nos 7 terrains disponibles 7j/7.',
      keywords:
        'réserver terrain padel, booking padel bayonne, réservation court padel en ligne, padel bayonne réservation',
      pathname: '/reservation',
      image: '/images/og-image.webp',
      imageAlt: 'Réserver un terrain de padel à Bayonne - Pasio Padel Club'
    })

    return {
      meta: seoData.meta,
      links: [
        ...seoData.links,
        {
          rel: 'preload',
          href: '/images/terrain.webp',
          as: 'image',
          type: 'image/webp'
        }
      ]
    }
  }
})
