import React from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  CalendarIcon,
  CheckCircleIcon,
  HistoryIcon,
  UserIcon,
  WalletIcon,
  XIcon
} from 'lucide-react'
import { z } from 'zod'
import {
  Tabs,
  TabsList,
  TabsTrigger
} from '@/components/animate-ui/components/animate/tabs'
import { BookingCardSkeleton } from '@/components/booking-card'
import { EmailVerificationAlert } from '@/components/email-verification-alert'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getUpcomingBookingsQueryOpts } from '@/constants/queries'
import { SECOND } from '@/constants/time'
import { seo } from '@/utils/seo'
import {
  createFileRoute,
  useNavigate,
  useRouteContext
} from '@tanstack/react-router'
import { CreditsTab, CreditsTabSkeleton } from './-tabs/credits'
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

type TabConfig = {
  value: string
  label: string
  icon: LucideIcon
}

const TABS = [
  { value: 'reservations', label: 'Réservations', icon: CalendarIcon },
  { value: 'historique', label: 'Historique', icon: HistoryIcon },
  { value: 'credits', label: 'Crédits', icon: WalletIcon },
  { value: 'profil', label: 'Profil', icon: UserIcon }
] as const satisfies TabConfig[]

const TAB_VALUES = TABS.map((tab) => {
  return tab.value
})
type Tab = (typeof TABS)[number]['value']

const searchSchema = z.object({
  tab: z.enum(TAB_VALUES).optional().catch('reservations'),
  'email-verified': z.boolean().optional()
})

const MonComptePage = () => {
  const { user } = useRouteContext({ from: '/_authenticated' })
  const search = Route.useSearch()
  const tab = search.tab ?? 'reservations'
  const isEmailJustVerified = search['email-verified'] === true
  const navigate = useNavigate({ from: Route.fullPath })

  const handleTabChange = (value: string) => {
    void navigate({
      search: { tab: value as Tab },
      to: '.',
      replace: true,
      resetScroll: false
    })
  }

  const handleDismissEmailVerified = () => {
    void navigate({
      search: { tab },
      to: '.',
      replace: true,
      resetScroll: false
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center font-display text-3xl font-bold">
          Mon compte
        </h1>
        {isEmailJustVerified ? (
          <Alert variant="success" className="mb-6">
            <CheckCircleIcon aria-hidden="true" />
            <AlertTitle>Email vérifié avec succès</AlertTitle>
            <AlertDescription>
              Merci ! Votre adresse email a été confirmée. Vous pouvez
              maintenant réserver un terrain.
            </AlertDescription>
            <button
              type="button"
              onClick={handleDismissEmailVerified}
              className="absolute top-3 right-3 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              aria-label="Fermer"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </Alert>
        ) : null}
        {!user.emailVerified && !isEmailJustVerified ? (
          <EmailVerificationAlert email={user.email} />
        ) : null}
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
          {tab === 'reservations' ? (
            <React.Suspense fallback={<BookingsSkeleton />}>
              <UpcomingBookingsTab />
            </React.Suspense>
          ) : null}
          {tab === 'historique' ? (
            <React.Suspense fallback={<BookingsSkeleton />}>
              <HistoryTab />
            </React.Suspense>
          ) : null}
          {tab === 'credits' ? (
            <React.Suspense fallback={<CreditsTabSkeleton />}>
              <CreditsTab />
            </React.Suspense>
          ) : null}
          {tab === 'profil' ? (
            <React.Suspense fallback={<ProfileTabSkeleton />}>
              <ProfileTab user={user} />
            </React.Suspense>
          ) : null}
        </Tabs>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/mon-compte/')({
  validateSearch: searchSchema,
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(getUpcomingBookingsQueryOpts())
  },
  staleTime: 30 * SECOND,
  component: MonComptePage,
  head: () => {
    const seoData = seo({
      title: 'Mon compte',
      description:
        'Gérez vos réservations de padel, consultez votre historique et modifiez vos informations personnelles.',
      pathname: '/mon-compte'
    })

    return {
      meta: [{ name: 'robots', content: 'noindex,nofollow' }, ...seoData.meta],
      links: seoData.links
    }
  }
})
