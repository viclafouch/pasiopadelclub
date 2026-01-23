import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ArrowRightIcon, CalendarCheckIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { Skeleton } from '@/components/ui/skeleton'
import { getUpcomingBookingsQueryOpts } from '@/constants/queries'
import { formatTimeFr } from '@/helpers/date'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

const formatNextBookingLabel = (startAt: Date) => {
  const now = new Date()
  const diffMs = startAt.getTime() - now.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  if (diffHours < 1) {
    const diffMinutes = Math.round(diffMs / (1000 * 60))

    return `Dans ${diffMinutes} min`
  }

  if (diffHours < 24) {
    return formatDistanceToNow(startAt, { addSuffix: false, locale: fr })
  }

  const startDate = new Date(startAt)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const isToday = startDate.toDateString() === today.toDateString()
  const isTomorrow = startDate.toDateString() === tomorrow.toDateString()

  if (isToday) {
    return `Aujourd'hui ${formatTimeFr(startAt)}`
  }

  if (isTomorrow) {
    return `Demain ${formatTimeFr(startAt)}`
  }

  return formatDistanceToNow(startAt, { addSuffix: true, locale: fr })
}

export const NextBookingBadge = () => {
  const upcomingQuery = useQuery(getUpcomingBookingsQueryOpts())

  if (upcomingQuery.isPending) {
    return <Skeleton className="h-14 w-56" />
  }

  if (upcomingQuery.isError) {
    return null
  }

  const nextBooking = upcomingQuery.data[0]

  if (!nextBooking) {
    return (
      <Link
        to="/mon-compte"
        className="group flex items-center gap-3 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-2.5 text-sm transition-colors hover:border-muted-foreground/50 hover:bg-muted/50"
      >
        <CalendarCheckIcon
          className="size-5 text-muted-foreground"
          aria-hidden="true"
        />
        <span className="text-muted-foreground">Aucune réservation</span>
        <ArrowRightIcon
          className="size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link
        to="/mon-compte"
        className="group flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 transition-colors hover:border-primary/40 hover:bg-primary/10"
      >
        <div className="relative">
          <span
            className="absolute inset-0 animate-ping rounded-full bg-primary/40"
            aria-hidden="true"
          />
          <span
            className="relative block size-2.5 rounded-full bg-primary"
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-primary">
            Prochaine réservation
          </span>
          <span className="text-sm text-foreground">
            {formatNextBookingLabel(nextBooking.startAt)}
            {' · '}
            <span className="text-muted-foreground">
              {nextBooking.court.name}
            </span>
          </span>
        </div>
        <ArrowRightIcon
          className="size-4 text-primary/60 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  )
}
