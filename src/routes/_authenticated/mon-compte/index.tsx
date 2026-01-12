import React from 'react'
import { CalendarIcon, HistoryIcon, UserIcon } from 'lucide-react'
import { BookingCardSkeleton } from '@/components/booking-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '~/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { createFileRoute } from '@tanstack/react-router'
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

const MonComptePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mon compte</h1>
        <Tabs defaultValue="reservations">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="reservations" className="gap-2">
              <CalendarIcon className="size-4" />
              <span className="hidden sm:inline">Réservations</span>
            </TabsTrigger>
            <TabsTrigger value="historique" className="gap-2">
              <HistoryIcon className="size-4" />
              <span className="hidden sm:inline">Historique</span>
            </TabsTrigger>
            <TabsTrigger value="profil" className="gap-2">
              <UserIcon className="size-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="reservations">
            <React.Suspense fallback={<BookingsSkeleton />}>
              <UpcomingBookingsTab />
            </React.Suspense>
          </TabsContent>
          <TabsContent value="historique">
            <React.Suspense fallback={<BookingsSkeleton />}>
              <HistoryTab />
            </React.Suspense>
          </TabsContent>
          <TabsContent value="profil">
            <React.Suspense fallback={<div>Chargement...</div>}>
              <ProfileTab />
            </React.Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/mon-compte/')({
  loader: async ({ context }) => {
    // Await only the first visible tab
    await Promise.all([
      context.queryClient.ensureQueryData(
        convexQuery(api.bookings.getUpcoming, {})
      ),
      context.queryClient.ensureQueryData(
        convexQuery(api.bookings.getActiveCount, {})
      )
    ])

    // Prefetch other tabs in background (no await)
    context.queryClient.ensureQueryData(
      convexQuery(api.bookings.getPast, { limit: 20 })
    )
    context.queryClient.ensureQueryData(convexQuery(api.users.getCurrent, {}))
  },
  component: MonComptePage
})
