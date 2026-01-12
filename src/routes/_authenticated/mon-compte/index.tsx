import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { CalendarIcon, HistoryIcon, UserIcon } from 'lucide-react'
import { z } from 'zod'
import { BookingCardSkeleton } from '@/components/booking-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '~/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { HistoryTab } from './-tabs/history'
import { ProfileTab } from './-tabs/profile'
import { UpcomingBookingsTab } from './-tabs/upcoming-bookings'

const BookingsSkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <BookingCardSkeleton />
      <BookingCardSkeleton />
    </div>
  )
}

type TabConfig = {
  value: string
  label: string
  icon: LucideIcon
  component: React.ComponentType
  fallback: React.ReactNode
}

const TABS = [
  {
    value: 'reservations',
    label: 'Réservations',
    icon: CalendarIcon,
    component: UpcomingBookingsTab,
    fallback: <BookingsSkeleton />
  },
  {
    value: 'historique',
    label: 'Historique',
    icon: HistoryIcon,
    component: HistoryTab,
    fallback: <BookingsSkeleton />
  },
  {
    value: 'profil',
    label: 'Profil',
    icon: UserIcon,
    component: ProfileTab,
    fallback: <div>Chargement...</div>
  }
] as const satisfies TabConfig[]

const TAB_VALUES = TABS.map((tab) => {
  return tab.value
})
type Tab = (typeof TABS)[number]['value']

const searchSchema = z.object({
  tab: z.enum(TAB_VALUES).optional().catch('reservations')
})

const MonComptePage = () => {
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mon compte</h1>
        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList className="mb-6 w-full justify-start">
            {TABS.map((tabConfig) => {
              return (
                <TabsTrigger
                  key={tabConfig.value}
                  value={tabConfig.value}
                  className="gap-2"
                >
                  <tabConfig.icon className="size-4" />
                  <span className="hidden sm:inline">{tabConfig.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
          {TABS.map((tabConfig) => {
            return (
              <TabsContent
                key={tabConfig.value}
                value={tabConfig.value}
                forceMount
                className="data-[state=inactive]:hidden"
              >
                <React.Suspense fallback={tabConfig.fallback}>
                  <tabConfig.component />
                </React.Suspense>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/mon-compte/')({
  validateSearch: searchSchema,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(
      convexQuery(api.bookings.getUpcoming, {})
    )
    context.queryClient.ensureQueryData(
      convexQuery(api.bookings.getActiveCount, {})
    )
    context.queryClient.ensureQueryData(
      convexQuery(api.bookings.getPast, { limit: 20 })
    )
    context.queryClient.ensureQueryData(convexQuery(api.users.getCurrent, {}))
  },
  component: MonComptePage
})
