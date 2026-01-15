import React from 'react'
import { CalendarIcon, HistoryIcon, UserIcon } from 'lucide-react'
import { z } from 'zod'
import { BookingCardSkeleton } from '@/components/booking-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { seo } from '@/utils/seo'
import {
  createFileRoute,
  useNavigate,
  useRouteContext
} from '@tanstack/react-router'
import { HistoryTab } from './-tabs/history'
import { ProfileTab, ProfileTabSkeleton } from './-tabs/profile'
import { UpcomingBookingsTab } from './-tabs/upcoming-bookings'

const BookingsSkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <BookingCardSkeleton />
      <BookingCardSkeleton />
    </div>
  )
}

const TABS = [
  { value: 'reservations', label: 'Réservations', icon: CalendarIcon },
  { value: 'historique', label: 'Historique', icon: HistoryIcon },
  { value: 'profil', label: 'Profil', icon: UserIcon }
] as const

const TAB_VALUES = TABS.map((tab) => {
  return tab.value
})
type Tab = (typeof TABS)[number]['value']

const searchSchema = z.object({
  tab: z.enum(TAB_VALUES).optional().catch('reservations')
})

const MonComptePage = () => {
  const { user } = useRouteContext({ from: '__root__' })
  const { tab = 'reservations' } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const handleTabChange = (value: string) => {
    navigate({
      search: { tab: value as Tab },
      to: '.',
      replace: true
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-display text-3xl font-bold">Mon compte</h1>
        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList className="mb-6 w-full justify-start">
            {TABS.map((tabConfig) => {
              return (
                <TabsTrigger
                  key={tabConfig.value}
                  value={tabConfig.value}
                  className="gap-2"
                >
                  <tabConfig.icon className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{tabConfig.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
          <TabsContent
            value="reservations"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <React.Suspense fallback={<BookingsSkeleton />}>
              <UpcomingBookingsTab />
            </React.Suspense>
          </TabsContent>
          <TabsContent
            value="historique"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <React.Suspense fallback={<BookingsSkeleton />}>
              <HistoryTab />
            </React.Suspense>
          </TabsContent>
          <TabsContent
            value="profil"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <React.Suspense fallback={<ProfileTabSkeleton />}>
              {user ? <ProfileTab user={user} /> : null}
            </React.Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/mon-compte/')({
  validateSearch: searchSchema,
  component: MonComptePage,
  head: () => {
    return {
      meta: seo({
        title: 'Mon compte',
        description:
          'Gérez vos réservations de padel, consultez votre historique et modifiez vos informations personnelles.',
        pathname: '/mon-compte'
      })
    }
  }
})
