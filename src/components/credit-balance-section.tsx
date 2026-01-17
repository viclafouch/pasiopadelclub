import { differenceInDays } from 'date-fns'
import { AlertTriangleIcon, WalletIcon } from 'lucide-react'
import {
  getNextExpiringCreditsQueryOpts,
  getUserBalanceQueryOpts
} from '@/constants/queries'
import { EXPIRATION_WARNING_DAYS } from '@/constants/wallet'
import { nowParis } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

export const CreditBalanceSectionSkeleton = () => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-7 w-16" />
        </div>
      </div>
      <Skeleton className="h-9 w-36" />
    </div>
  )
}

export const CreditBalanceSection = () => {
  const balanceQuery = useSuspenseQuery(getUserBalanceQueryOpts())
  const expiringQuery = useSuspenseQuery(getNextExpiringCreditsQueryOpts())

  const daysUntilExpiration =
    expiringQuery.data !== null
      ? differenceInDays(expiringQuery.data.expiresAt, nowParis())
      : null
  const shouldShowWarning =
    daysUntilExpiration !== null &&
    daysUntilExpiration <= EXPIRATION_WARNING_DAYS

  return (
    <div className="space-y-3 rounded-lg border p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <WalletIcon className="size-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Solde crédits</p>
            <p className="font-display text-2xl font-bold">
              {formatCentsToEuros(balanceQuery.data)}
            </p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link to="/credits">Acheter des crédits</Link>
        </Button>
      </div>
      {shouldShowWarning && expiringQuery.data ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700"
        >
          <AlertTriangleIcon
            className="mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />
          <p>
            {formatCentsToEuros(expiringQuery.data.amountCents)} expirent dans{' '}
            {daysUntilExpiration} jour{daysUntilExpiration !== 1 ? 's' : ''}
          </p>
        </div>
      ) : null}
    </div>
  )
}
