import { motion, type Variants } from 'motion/react'
import { CLUB_INFO } from '@/constants/app'
import { LOCATION_LABELS } from '@/constants/court'
import type { SelectedSlot } from '@/constants/types'
import { formatDateFr, formatTimeFr } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
import { AMENITIES, ANIMATION_EASING, type SummaryItem } from './constants'

type StepRecapProps = {
  selectedSlot: SelectedSlot
}

const CONTAINER_VARIANTS = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06
    }
  }
} as const satisfies Variants

const ITEM_VARIANTS = {
  hidden: { opacity: 0, translateY: 10 },
  visible: {
    opacity: 1,
    translateY: 0,
    transition: {
      duration: 0.25,
      ease: ANIMATION_EASING
    }
  }
} as const satisfies Variants

export const StepRecap = ({ selectedSlot }: StepRecapProps) => {
  const { court, slot } = selectedSlot
  const startDate = new Date(slot.startAt)
  const endDate = new Date(slot.endAt)

  const bookingItems: SummaryItem[] = [
    {
      emoji: '🏟️',
      bg: 'bg-violet-100/60',
      title: court.name,
      subtitle: formatCentsToEuros(court.price)
    },
    {
      emoji: '📅',
      bg: 'bg-blue-100/60',
      title: formatDateFr(startDate),
      subtitle: `${formatTimeFr(startDate)} - ${formatTimeFr(endDate)} (${court.duration} min)`
    },
    {
      emoji: '👥',
      bg: 'bg-emerald-100/60',
      title: `${court.capacity} joueurs`,
      subtitle: `Terrain ${LOCATION_LABELS[court.location].toLowerCase()}`
    },
    {
      emoji: '📍',
      bg: 'bg-red-100/60',
      title: CLUB_INFO.address.city,
      subtitle: CLUB_INFO.address.street
    }
  ]

  const allItems = [...bookingItems, ...AMENITIES]

  return (
    <motion.div
      className="grid gap-2 sm:grid-cols-2"
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
    >
      {allItems.map((item) => {
        return (
          <motion.div
            key={item.title}
            variants={ITEM_VARIANTS}
            className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3"
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-full ${item.bg}`}
              aria-hidden="true"
            >
              <span className="text-lg">{item.emoji}</span>
            </div>
            <div className="text-sm">
              <p className="font-medium">{item.title}</p>
              <p className="text-muted-foreground">{item.subtitle}</p>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
