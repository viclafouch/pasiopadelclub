import type { LucideIcon } from 'lucide-react'
import {
  CheckCircleIcon,
  ClockIcon,
  LockIcon,
  UserIcon,
  XCircleIcon
} from 'lucide-react'
import type { Slot, SlotStatus } from '@/constants/types'
import { formatTimeFr } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
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
    buttonClass: 'border-success bg-success/10 hover:bg-success/20',
    textClass: 'font-semibold text-success'
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

const OWN_BOOKING_CONFIG: StatusConfig = {
  icon: UserIcon,
  label: 'Réservé par vous',
  buttonClass: 'cursor-not-allowed border-info/50 bg-info/10',
  textClass: 'text-info'
}

const getStatusConfig = (slot: Slot) => {
  return slot.isOwnBooking ? OWN_BOOKING_CONFIG : STATUS_CONFIG[slot.status]
}

type SlotCardProps = {
  slot: Slot
  price: number
  onSelect?: (slot: Slot) => void
}

export const SlotCard = ({ slot, price, onSelect }: SlotCardProps) => {
  const config = getStatusConfig(slot)
  const Icon = config.icon
  const isClickable = slot.status === 'available'

  const handleClick = () => {
    if (isClickable && onSelect) {
      onSelect(slot)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isClickable}
      className={cn(
        'flex w-full flex-col items-center gap-1.5 rounded-xl border-2 px-4 py-4 transition-colors duration-300 ease-out',
        config.buttonClass
      )}
    >
      <span className="text-base font-bold">
        {formatTimeFr(new Date(slot.startAt))} -{' '}
        {formatTimeFr(new Date(slot.endAt))}
      </span>
      <span
        className={cn(
          'flex items-center gap-1.5 text-sm transition-colors duration-300',
          config.textClass
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
        {slot.status === 'available' && !slot.isOwnBooking
          ? formatCentsToEuros(price, { minimumFractionDigits: 0 })
          : config.label}
      </span>
    </button>
  )
}
