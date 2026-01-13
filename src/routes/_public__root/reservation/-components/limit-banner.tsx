import { AlertCircleIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'

type LimitBannerProps = {
  maxCount: number
}

export const LimitBanner = ({ maxCount }: LimitBannerProps) => {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3"
    >
      <AlertCircleIcon
        className="size-5 shrink-0 text-amber-600"
        aria-hidden="true"
      />
      <p className="text-sm text-amber-700">
        Vous avez atteint la limite de {maxCount} réservations actives.{' '}
        <Link
          to="/mon-compte"
          search={{ tab: 'reservations' }}
          className="font-medium underline underline-offset-2 hover:no-underline"
        >
          Gérer mes réservations
        </Link>
      </p>
    </div>
  )
}
