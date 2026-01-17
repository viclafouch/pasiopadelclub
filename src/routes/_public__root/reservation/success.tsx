import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  HomeIcon,
  MapPinIcon,
  UsersIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  getActiveBookingCountQueryOpts,
  getLatestBookingQueryOpts,
  getSlotsByDateQueryOpts,
  getUpcomingBookingsQueryOpts
} from '@/constants/queries'
import type { BookingWithCourt } from '@/constants/types'
import { formatDateFr, formatTimeFr } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
import { getCourtTypeLabel, getLocationLabel } from '@/utils/court'
import { seo } from '@/utils/seo'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

type BookingTicketProps = {
  booking: BookingWithCourt
}

type InfoBlockProps = {
  icon: React.ReactNode
  label: string
  value: string
}

const InfoBlock = ({ icon, label, value }: InfoBlockProps) => {
  return (
    <div className="space-y-1 rounded-xl bg-white/20 p-4 text-left">
      <div className="flex items-center gap-2 text-white/70">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="font-display text-lg font-medium text-white">{value}</p>
    </div>
  )
}

const TicketHeader = () => {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary">
          <CheckIcon
            className="size-5 text-primary-foreground"
            aria-hidden="true"
          />
        </div>
        <span className="text-sm font-medium tracking-wide text-white uppercase">
          Confirmé
        </span>
      </div>
      <span className="font-display text-sm tracking-wider text-white/70 uppercase">
        Pasio Padel
      </span>
    </div>
  )
}

const TicketDivider = () => {
  return (
    <div className="relative">
      <div className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-muted/30" />
      <div className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-muted/30" />
      <div className="mx-6 border-t border-dashed border-white/30 sm:mx-8" />
    </div>
  )
}

type TicketFooterProps = {
  duration: number
  price: number
}

const TicketFooter = ({ duration, price }: TicketFooterProps) => {
  return (
    <div className="flex items-center justify-between px-6 py-6 sm:px-8">
      <div className="text-left">
        <p className="text-xs text-white/70 uppercase tracking-wide">Durée</p>
        <p className="font-display text-lg font-medium text-white">
          {duration} min
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-white/70 uppercase tracking-wide">
          Total payé
        </p>
        <p className="font-display text-2xl font-semibold text-white">
          {formatCentsToEuros(price)}
        </p>
      </div>
    </div>
  )
}

const BookingTicket = ({ booking }: BookingTicketProps) => {
  const startDate = new Date(booking.startAt)
  const endDate = new Date(booking.endAt)

  const infoBlocks = [
    {
      icon: <CalendarIcon className="size-4" aria-hidden="true" />,
      label: 'Date',
      value: formatDateFr(startDate)
    },
    {
      icon: <ClockIcon className="size-4" aria-hidden="true" />,
      label: 'Horaire',
      value: `${formatTimeFr(startDate)} → ${formatTimeFr(endDate)}`
    },
    {
      icon: <MapPinIcon className="size-4" aria-hidden="true" />,
      label: 'Emplacement',
      value: getLocationLabel(booking.court.location)
    },
    {
      icon: <UsersIcon className="size-4" aria-hidden="true" />,
      label: 'Capacité',
      value: `${booking.court.capacity} joueurs`
    }
  ]

  return (
    <div className="w-full max-w-lg">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute inset-0">
          <picture>
            <source srcSet="/images/terrain.webp" type="image/webp" />
            <img
              src="/images/terrain.jpg"
              alt=""
              className="h-full w-full object-cover"
              aria-hidden="true"
            />
          </picture>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/90 to-slate-900/70" />
        <div className="relative">
          <TicketHeader />
          <div className="space-y-6 px-6 py-8 sm:px-8">
            <div className="text-center">
              <p className="mb-2 inline-block rounded bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground uppercase tracking-wide">
                {getCourtTypeLabel(booking.court.type)}
              </p>
              <h2 className="font-display text-4xl font-light tracking-tight text-white sm:text-5xl">
                {booking.court.name}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {infoBlocks.map((block) => {
                return (
                  <InfoBlock
                    key={block.label}
                    icon={block.icon}
                    label={block.label}
                    value={block.value}
                  />
                )
              })}
            </div>
          </div>
          <TicketDivider />
          <TicketFooter
            duration={booking.court.duration}
            price={booking.price}
          />
        </div>
      </div>
    </div>
  )
}

const ReservationSuccessPage = () => {
  const latestBookingQuery = useSuspenseQuery(getLatestBookingQueryOpts())

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container flex min-h-screen flex-col items-center justify-center py-12">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="space-y-3">
            <p className="text-sm font-medium text-primary uppercase tracking-wide">
              Réservation confirmée
            </p>
            <h1 className="font-display text-4xl font-light tracking-tight sm:text-5xl">
              À très vite sur le terrain !
            </h1>
            <p className="mx-auto max-w-md text-muted-foreground">
              Vous recevrez un email de confirmation avec tous les détails de
              votre réservation.
            </p>
          </div>
          {latestBookingQuery.data ? (
            <BookingTicket booking={latestBookingQuery.data} />
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link to="/mon-compte" search={{ tab: 'reservations' }}>
                <CalendarIcon className="size-4" aria-hidden="true" />
                Mes réservations
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8"
              asChild
            >
              <Link to="/">
                <HomeIcon className="size-4" aria-hidden="true" />
                Retour à l&apos;accueil
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/_public__root/reservation/success')({
  beforeLoad: ({ context }) => {
    context.queryClient.invalidateQueries({
      queryKey: getUpcomingBookingsQueryOpts.all
    })
    context.queryClient.invalidateQueries({
      queryKey: getActiveBookingCountQueryOpts.all
    })
    context.queryClient.invalidateQueries({
      queryKey: getSlotsByDateQueryOpts.all
    })
  },
  head: () => {
    return {
      meta: seo({
        title: 'Réservation confirmée',
        description: 'Votre réservation a été confirmée avec succès.'
      })
    }
  },
  component: ReservationSuccessPage
})
