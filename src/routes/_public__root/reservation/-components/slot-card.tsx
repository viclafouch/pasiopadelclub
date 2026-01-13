import type { LucideIcon } from 'lucide-react'
import { CheckCircleIcon, ClockIcon, LockIcon, XCircleIcon } from 'lucide-react'
import type { SlotStatus } from '@/constants/types'
import { formatTimeFr } from '@/helpers/date'
import { cn } from '@/lib/utils'

type StatusConfig = {
  icon: LucideIcon
  label: string
  buttonClass: string
  textClass: string
}

const STATUS_CONFIG: Record<SlotStatus, StatusConfig> = {
  available: {
    icon: CheckCircleIcon,
    label: '',
    buttonClass: 'border-primary bg-primary/10 hover:bg-primary/20',
    textClass: 'font-semibold text-primary'
  },
  booked: {
    icon: XCircleIcon,
    label: 'Réservé',
    buttonClass: 'cursor-not-allowed border-destructive/30 bg-destructive/5',
    textClass: 'text-destructive/80'
  },
  blocked: {
    icon: LockIcon,
    label: 'Indisponible',
    buttonClass: 'cursor-not-allowed border-muted bg-muted/30',
    textClass: 'text-muted-foreground'
  },
  past: {
    icon: ClockIcon,
    label: 'Passé',
    buttonClass: 'cursor-not-allowed border-muted/50 bg-muted/20 opacity-60',
    textClass: 'text-muted-foreground'
  }
}

type SlotCardProps = {
  startAt: number
  endAt: number
  price: number
  status: SlotStatus
  onSelect?: () => void
}

export const SlotCard = ({
  startAt,
  endAt,
  price,
  status,
  onSelect
}: SlotCardProps) => {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon
  const isClickable = status === 'available'

  const handleClick = () => {
    if (isClickable && onSelect) {
      onSelect()
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isClickable}
      className={cn(
        'flex w-full flex-col items-center gap-1.5 rounded-xl border-2 px-4 py-4 transition-all duration-300 ease-out',
        config.buttonClass
      )}
    >
      <span className="text-base font-bold">
        {formatTimeFr(new Date(startAt))} - {formatTimeFr(new Date(endAt))}
      </span>
      <span
        className={cn(
          'flex items-center gap-1.5 text-sm transition-all duration-300',
          config.textClass
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
        {status === 'available' ? `${price}€` : config.label}
      </span>
    </button>
  )
}
