import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LOCATION_LABELS } from '@/constants/court'
import type { Court, SelectedSlot } from '@/constants/types'
import { formatDateFr, formatTimeFr } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'

type AvatarData = {
  url: string
  fallback: string
}

const PLAYER_AVATARS = {
  double: [
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Marie&baseColor=f9c9b6&backgroundColor=ffdfbf&mouth=smile',
      fallback: 'MA'
    },
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Jean&baseColor=ac6651&backgroundColor=c0aede&mouth=smile',
      fallback: 'JE'
    },
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Sophie&baseColor=f9c9b6&backgroundColor=ffd5dc&mouth=smile',
      fallback: 'SO'
    },
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Marc&baseColor=ac6651&backgroundColor=d1f4d9&mouth=smile',
      fallback: 'MR'
    }
  ],
  simple: [
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Camille&baseColor=f9c9b6&backgroundColor=ffd5dc&mouth=smile',
      fallback: 'CA'
    },
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Lucas&baseColor=ac6651&backgroundColor=c0aede&mouth=smile',
      fallback: 'LU'
    }
  ],
  kids: [
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Emma&baseColor=f9c9b6&backgroundColor=ffeaa7&mouth=laughing',
      fallback: 'EM'
    },
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Hugo&baseColor=f9c9b6&backgroundColor=a8e6cf&mouth=laughing',
      fallback: 'HU'
    }
  ]
} as const satisfies Record<Court['type'], readonly AvatarData[]>

type AvatarGroupProps = {
  avatars: readonly AvatarData[]
}

const AvatarGroup = ({ avatars }: AvatarGroupProps) => {
  return (
    <div className="flex -space-x-2" aria-hidden="true">
      {avatars.map((avatar) => {
        return (
          <Avatar
            key={avatar.fallback}
            className="size-9 ring-2 ring-background"
          >
            <AvatarImage src={avatar.url} alt="" />
            <AvatarFallback className="text-xs">
              {avatar.fallback}
            </AvatarFallback>
          </Avatar>
        )
      })}
    </div>
  )
}

type BookingSummaryProps = {
  selectedSlot: SelectedSlot
}

export const BookingSummary = ({ selectedSlot }: BookingSummaryProps) => {
  const { court, slot } = selectedSlot
  const startDate = new Date(slot.startAt)
  const endDate = new Date(slot.endAt)
  const avatars = PLAYER_AVATARS[court.type]

  return (
    <div className="space-y-3">
      <div className="rounded-xl border bg-muted/30 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">{court.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarIcon className="size-4" aria-hidden="true" />
                {formatDateFr(startDate)}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="size-4" aria-hidden="true" />
                {formatTimeFr(startDate)} - {formatTimeFr(endDate)}
              </span>
            </div>
          </div>
          <span className="text-xl font-bold text-primary">
            {formatCentsToEuros(court.price)}
          </span>
        </div>
      </div>
      <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-transparent p-4">
        <div className="flex items-center gap-4">
          <AvatarGroup avatars={avatars} />
          <div className="flex flex-1 items-center justify-between text-sm">
            <div className="space-y-0.5">
              <p className="flex items-center gap-1.5 font-medium">
                <UsersIcon className="size-4 text-primary" aria-hidden="true" />
                {court.capacity} joueurs
              </p>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <MapPinIcon className="size-4" aria-hidden="true" />
                {LOCATION_LABELS[court.location]}
              </p>
            </div>
            <p className="flex items-center gap-1.5 font-medium">
              <ClockIcon className="size-4 text-primary" aria-hidden="true" />
              {court.duration} min
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
