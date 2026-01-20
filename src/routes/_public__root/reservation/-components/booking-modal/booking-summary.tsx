import { CLUB_INFO } from '@/constants/app'
import { LOCATION_LABELS } from '@/constants/court'
import type { SelectedSlot } from '@/constants/types'
import { formatDateFr, formatTimeFr } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
import type { SummaryItem } from './constants'

type BookingSummaryProps = {
  selectedSlot: SelectedSlot
}

export const BookingSummary = ({ selectedSlot }: BookingSummaryProps) => {
  const { court, slot } = selectedSlot
  const startDate = new Date(slot.startAt)
  const endDate = new Date(slot.endAt)

  const items: SummaryItem[] = [
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

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => {
        return (
          <div
            key={item.title}
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
          </div>
        )
      })}
    </div>
  )
}
