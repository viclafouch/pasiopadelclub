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
import { Button } from '@/components/ui/button'
import { getLatestBookingQueryOpts } from '@/constants/queries'
import type { BookingWithCourt } from '@/constants/types'
import { formatDateFr, formatTimeFr } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
import { getCourtTypeLabel, getLocationLabel } from '@/utils/court'
import { seo } from '@/utils/seo'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

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
  shouldReduceMotion: boolean | null
}

const ConfettiPiece = ({ index, shouldReduceMotion }: ConfettiPieceProps) => {
  const randomX = (Math.random() - 0.5) * 600
  const randomY = -Math.random() * 400 - 100
  const randomRotation = Math.random() * 720 - 360
  const randomDelay = Math.random() * 0.3
  const randomDuration = 2 + Math.random() * 1.5
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length]
  const size = 6 + Math.random() * 8
  const isCircle = Math.random() > 0.5

  if (shouldReduceMotion) {
    return null
  }

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
        top: '50%'
      }}
    />
  )
}

type ConfettiProps = {
  shouldReduceMotion: boolean | null
}

const Confetti = ({ shouldReduceMotion }: ConfettiProps) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: CONFETTI_COUNT }).map((_, pieceIndex) => {
        return (
          <ConfettiPiece
            key={pieceIndex}
            index={pieceIndex}
            shouldReduceMotion={shouldReduceMotion}
          />
        )
      })}
    </div>
  )
}

type SuccessCheckmarkProps = {
  shouldReduceMotion: boolean | null
}

const SuccessCheckmark = ({ shouldReduceMotion }: SuccessCheckmarkProps) => {
  const checkVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  }

  const glowVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.8, 0],
      transition: {
        duration: 1.5,
        delay: 0.4,
        ease: 'easeOut'
      }
    }
  }

  const ringVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 20,
        delay: 0.1
      }
    }
  }

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        variants={shouldReduceMotion ? undefined : glowVariants}
        initial="hidden"
        animate="visible"
        className="absolute size-28 rounded-full bg-primary/30 blur-xl"
      />
      <motion.div
        variants={shouldReduceMotion ? undefined : ringVariants}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        animate="visible"
        className="absolute size-24 rounded-full border-4 border-primary/20"
      />
      <motion.div
        variants={shouldReduceMotion ? undefined : checkVariants}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        animate="visible"
        className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-600 shadow-lg shadow-primary/30"
      >
        <motion.div
          initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
        >
          <CheckIcon
            className="size-10 text-primary-foreground"
            strokeWidth={3}
            aria-hidden="true"
          />
        </motion.div>
      </motion.div>
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
    <div className="space-y-1 rounded-xl bg-white/20 p-4 text-left backdrop-blur-sm">
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
        <span className="text-sm font-medium uppercase tracking-wide text-white">
          Confirmé
        </span>
      </div>
      <span className="font-display text-sm uppercase tracking-wider text-white/70">
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
        <p className="text-xs uppercase tracking-wide text-white/70">Durée</p>
        <p className="font-display text-lg font-medium text-white">
          {duration} min
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs uppercase tracking-wide text-white/70">
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
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/90 to-slate-900/70" />
        <div className="relative">
          <TicketHeader />
          <div className="space-y-6 px-6 py-8 sm:px-8">
            <div className="text-center">
              <p className="mb-2 inline-block rounded bg-primary px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
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
  const latestBookingQuery = useQuery(getLatestBookingQueryOpts())
  const shouldReduceMotion = useReducedMotion()

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-muted/30 via-background to-muted/30">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 size-96 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>
      <AnimatePresence>
        <Confetti shouldReduceMotion={shouldReduceMotion} />
      </AnimatePresence>
      <div className="container relative flex min-h-screen flex-col items-center justify-center py-12">
        <motion.div
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          animate="visible"
          className="flex flex-col items-center gap-8 text-center"
          style={{ perspective: 1000 }}
        >
          <motion.div
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="mb-2"
          >
            <SuccessCheckmark shouldReduceMotion={shouldReduceMotion} />
          </motion.div>
          <motion.div
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="space-y-3"
          >
            <motion.p
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="text-sm font-medium uppercase tracking-wide text-primary"
            >
              Réservation confirmée
            </motion.p>
            <motion.h1
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="font-display text-4xl font-light tracking-tight sm:text-5xl"
            >
              À très vite sur le terrain !
            </motion.h1>
            <motion.p
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="mx-auto max-w-md text-muted-foreground"
            >
              Vous recevrez un email de confirmation avec tous les détails de
              votre réservation.
            </motion.p>
          </motion.div>
          {latestBookingQuery.data ? (
            <motion.div
              variants={shouldReduceMotion ? undefined : ticketVariants}
              initial={shouldReduceMotion ? 'visible' : 'hidden'}
              animate="visible"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <BookingTicket booking={latestBookingQuery.data} />
            </motion.div>
          ) : null}
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
  head: () => {
    return {
      ...seo({
        title: 'Réservation confirmée',
        description: 'Votre réservation a été confirmée avec succès.'
      })
    }
  },
  component: ReservationSuccessPage
})
