import React from 'react'
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  HomeIcon,
  MapPinIcon,
  UsersIcon
} from 'lucide-react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants
} from 'motion/react'
import { TiltCard } from '@/components/tilt-card'
import { Button } from '@/components/ui/button'
import {
  getActiveBookingCountQueryOpts,
  getLatestBookingQueryOpts,
  getSlotsByDateQueryOpts,
  getUpcomingBookingsQueryOpts,
  getUserBalanceQueryOpts,
  getWalletTransactionsQueryOpts
} from '@/constants/queries'
import type { BookingWithCourt } from '@/constants/types'
import { formatDateFr, formatTimeFr } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
import { getCourtTypeLabel, getLocationLabel } from '@/utils/court'
import { seo } from '@/utils/seo'
import { useQueryClient } from '@tanstack/react-query'
import {
  ClientOnly,
  createFileRoute,
  Link,
  redirect
} from '@tanstack/react-router'

const CONFETTI_COLORS = [
  'rgb(var(--color-primary))',
  '#10b981',
  '#34d399',
  '#6ee7b7',
  '#fbbf24',
  '#f59e0b'
]

const CONFETTI_COUNT = 50

type ConfettiPieceProps = {
  index: number
}

const ConfettiPiece = ({ index }: ConfettiPieceProps) => {
  const randomX = (Math.random() - 0.5) * 600
  const randomY = -Math.random() * 400 - 100
  const randomRotation = Math.random() * 720 - 360
  const randomDelay = Math.random() * 0.3
  const randomDuration = 2 + Math.random() * 1.5
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length]
  const size = 6 + Math.random() * 8
  const isCircle = Math.random() > 0.5

  return (
    <motion.div
      initial={{
        translateX: 0,
        translateY: 0,
        scale: 0,
        rotate: 0,
        opacity: 1
      }}
      animate={{
        translateX: randomX,
        translateY: randomY,
        scale: [0, 1, 1, 0.5],
        rotate: randomRotation,
        opacity: [1, 1, 1, 0]
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        ease: [0.22, 1, 0.36, 1]
      }}
      style={{
        position: 'absolute',
        width: size,
        height: isCircle ? size : size * 0.4,
        backgroundColor: color,
        borderRadius: isCircle ? '50%' : '2px',
        left: '50%',
        top: '50%',
        willChange: 'transform, opacity'
      }}
    />
  )
}

type ConfettiProps = {
  shouldReduceMotion: boolean | null
}

const Confetti = ({ shouldReduceMotion }: ConfettiProps) => {
  if (shouldReduceMotion) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: CONFETTI_COUNT }).map((_, pieceIndex) => {
        return <ConfettiPiece key={pieceIndex} index={pieceIndex} />
      })}
    </div>
  )
}

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
    <div className="space-y-0.5 rounded-lg bg-white/20 p-2.5 text-left backdrop-blur-sm sm:space-y-1 sm:rounded-xl sm:p-4">
      <div className="flex items-center gap-1.5 text-white/70 sm:gap-2">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wide sm:text-xs">
          {label}
        </span>
      </div>
      <p className="font-display text-sm font-medium text-white sm:text-lg">
        {value}
      </p>
    </div>
  )
}

const TicketHeader = () => {
  return <div className="h-14 border-b border-white/10 sm:h-20" />
}

const TicketDivider = () => {
  return (
    <div className="relative">
      <div className="absolute -left-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-muted/30 sm:-left-3 sm:size-6" />
      <div className="absolute -right-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-muted/30 sm:-right-3 sm:size-6" />
      <div className="mx-4 border-t border-dashed border-white/30 sm:mx-8" />
    </div>
  )
}

type TicketFooterProps = {
  duration: number
  price: number
}

const TicketFooter = ({ duration, price }: TicketFooterProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
      <div className="text-left">
        <p className="text-[10px] uppercase tracking-wide text-white/70 sm:text-xs">
          Durée
        </p>
        <p className="font-display text-base font-medium text-white sm:text-lg">
          {duration} min
        </p>
      </div>
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-wide text-white/70 sm:text-xs">
          Total payé
        </p>
        <p className="font-display text-xl font-semibold text-white sm:text-2xl">
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
    <TiltCard className="relative mx-auto w-full md:max-w-lg overflow-hidden rounded-2xl shadow-2xl sm:rounded-3xl">
      <div className="absolute inset-0">
        <picture>
          <source srcSet="/images/terrain.webp" type="image/webp" />
          <img
            src="/images/terrain.jpg"
            alt=""
            className="h-full w-full object-cover"
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
      <div className="absolute inset-x-0 top-0 flex h-14 items-center justify-center sm:h-20">
        <img
          src="/images/logo-navbar.webp"
          alt=""
          aria-hidden="true"
          className="h-7 w-auto sm:h-10"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/90 to-slate-900/70" />
      <div className="relative">
        <TicketHeader />
        <div className="space-y-4 px-4 py-5 sm:space-y-6 sm:px-8 sm:py-8">
          <div className="text-center">
            <p className="mb-1.5 inline-block rounded bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground sm:mb-2 sm:px-2.5 sm:py-1 sm:text-xs">
              {getCourtTypeLabel(booking.court.type)}
            </p>
            <h2 className="font-display text-2xl font-light tracking-tight text-white sm:text-5xl">
              {booking.court.name}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
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
        <TicketFooter duration={booking.court.duration} price={booking.price} />
      </div>
    </TiltCard>
  )
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, translateY: 20 },
  visible: {
    opacity: 1,
    translateY: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
}

const ticketVariants: Variants = {
  hidden: {
    opacity: 0,
    translateY: 60,
    rotateX: 15
  },
  visible: {
    opacity: 1,
    translateY: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 20,
      delay: 0.6
    }
  }
}

const buttonVariants: Variants = {
  hidden: { opacity: 0, translateY: 20 },
  visible: {
    opacity: 1,
    translateY: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
}

const ReservationSuccessPage = () => {
  const { booking } = Route.useLoaderData()
  const queryClient = useQueryClient()
  const shouldReduceMotion = useReducedMotion()

  React.useEffect(() => {
    queryClient.invalidateQueries({ queryKey: getSlotsByDateQueryOpts.all })
    queryClient.invalidateQueries(getUserBalanceQueryOpts())
    queryClient.invalidateQueries(getWalletTransactionsQueryOpts())
    queryClient.invalidateQueries(getUpcomingBookingsQueryOpts())
    queryClient.invalidateQueries(getActiveBookingCountQueryOpts())
  }, [queryClient])

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-muted/30 via-background to-muted/30">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 size-96 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>
      <ClientOnly>
        <AnimatePresence>
          <Confetti shouldReduceMotion={shouldReduceMotion} />
        </AnimatePresence>
      </ClientOnly>
      <div className="container relative flex min-h-screen flex-col items-center justify-center py-12">
        <motion.div
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          animate="visible"
          className="flex w-full flex-col items-center gap-8 text-center"
          style={{ perspective: 1000 }}
        >
          <motion.div
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="flex items-center gap-2"
          >
            <div className="flex size-6 items-center justify-center rounded-full bg-primary">
              <CheckIcon
                className="size-3.5 text-primary-foreground"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Réservation confirmée
            </p>
          </motion.div>
          <motion.div
            variants={shouldReduceMotion ? undefined : ticketVariants}
            initial={shouldReduceMotion ? 'visible' : 'hidden'}
            animate="visible"
            className="w-full"
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          >
            <BookingTicket booking={booking} />
          </motion.div>
          <motion.p
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="text-sm text-muted-foreground"
          >
            Un email de confirmation vous a été envoyé.
          </motion.p>
          <motion.div
            variants={shouldReduceMotion ? undefined : containerVariants}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <motion.div
              variants={shouldReduceMotion ? undefined : buttonVariants}
            >
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link to="/mon-compte" search={{ tab: 'reservations' }}>
                  <CalendarIcon className="size-4" aria-hidden="true" />
                  Mes réservations
                </Link>
              </Button>
            </motion.div>
            <motion.div
              variants={shouldReduceMotion ? undefined : buttonVariants}
            >
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
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/_public__root/reservation/success')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/' })
    }
  },
  loader: async ({ context }) => {
    const booking = await context.queryClient.fetchQuery(
      getLatestBookingQueryOpts()
    )

    if (!booking) {
      throw redirect({ to: '/reservation' })
    }

    return { booking }
  },
  head: () => {
    const seoData = seo({
      title: 'Réservation confirmée',
      description: 'Votre réservation a été confirmée avec succès.',
      pathname: '/reservation/success'
    })

    return {
      meta: [{ name: 'robots', content: 'noindex,nofollow' }, ...seoData.meta],
      links: seoData.links
    }
  },
  component: ReservationSuccessPage
})
