import React from 'react'
import { CalendarIcon } from 'lucide-react'
import { z } from 'zod'
import {
  CLOSING_HOUR,
  MAX_ACTIVE_BOOKINGS,
  MIN_SESSION_MINUTES
} from '@/constants/booking'
import { COURT_TYPE_ORDER } from '@/constants/court'
import {
  getActiveBookingCountQueryOpts,
  getSlotsByDateQueryOpts
} from '@/constants/queries'
import type { Court, SelectedSlot, Slot } from '@/constants/types'
import { getDefaultBookingDateKey } from '@/helpers/date'
import { seo } from '@/utils/seo'
import {
  useQuery,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import {
  createFileRoute,
  useNavigate,
  useRouteContext
} from '@tanstack/react-router'
import { BookingSummaryModal } from './-components/booking-summary-modal'
import { CourtTypeGroup } from './-components/court-type-group'
import { DaySelector } from './-components/day-selector'
import { LimitBanner } from './-components/limit-banner'
import { LimitReachedDialog } from './-components/limit-reached-dialog'
import { SlotsSkeleton } from './-components/skeletons'

const searchSchema = z.object({
  date: z.string().optional()
})

type SlotsContentProps = {
  selectedDate: string
  isAtLimit: boolean
  onSlotSelect: (court: Court, slot: Slot) => void
}

const SlotsContent = ({
  selectedDate,
  isAtLimit,
  onSlotSelect
}: SlotsContentProps) => {
  const slotsQuery = useSuspenseQuery(getSlotsByDateQueryOpts(selectedDate))

  const courtGroups = React.useMemo(() => {
    const groupedByType = Map.groupBy(slotsQuery.data, (item) => {
      return item.court.type
    })

    return COURT_TYPE_ORDER.map((type) => {
      return {
        type,
        courts: groupedByType.get(type) ?? []
      }
    }).filter((group) => {
      return group.courts.length > 0
    })
  }, [slotsQuery.data])

  return (
    <>
      {isAtLimit ? <LimitBanner maxCount={MAX_ACTIVE_BOOKINGS} /> : null}
      {courtGroups.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-12 text-center">
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
        <div className="space-y-8">
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
  const { date } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const queryClient = useQueryClient()
  const [selectedSlot, setSelectedSlot] = React.useState<SelectedSlot | null>(
    null
  )
  const [isLimitDialogOpen, setIsLimitDialogOpen] = React.useState(false)

  const isAuthenticated = Boolean(user)
  const selectedDate =
    date ?? getDefaultBookingDateKey(CLOSING_HOUR, MIN_SESSION_MINUTES)

  const activeCountQuery = useQuery({
    ...getActiveBookingCountQueryOpts(),
    enabled: isAuthenticated
  })

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

  const handleSlotSelect = (court: Court, slot: Slot) => {
    if (!isAuthenticated) {
      const returnUrl = `/reservation?date=${selectedDate}`
      navigate({ to: '/connexion', search: { redirect: returnUrl } })

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

  return (
    <>
      <div className="space-y-6">
        <div className="day-selector-sticky sticky top-[var(--navbar-height)] z-10 sm:mx-auto sm:w-fit sm:max-w-full">
          <div className="day-selector-inner rounded-b-md bg-background py-2">
            <DaySelector
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              onDateHover={handleDateHover}
            />
          </div>
        </div>
        <React.Suspense fallback={<SlotsSkeleton />}>
          <SlotsContent
            selectedDate={selectedDate}
            isAtLimit={isAtLimit}
            onSlotSelect={handleSlotSelect}
          />
        </React.Suspense>
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
          <ReservationContent />
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
