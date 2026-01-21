import { differenceInDays } from 'date-fns'
import {
  AlertTriangleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  WalletIcon
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getNextExpiringCreditsQueryOpts,
  getUserBalanceQueryOpts,
  getWalletTransactionsQueryOpts
} from '@/constants/queries'
import type { WalletTransaction } from '@/constants/types'
import { EXPIRATION_WARNING_DAYS } from '@/constants/wallet'
import { formatDateFr, nowParis } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
import { cn } from '@/lib/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

const TRANSACTION_TYPE_CONFIG = {
  purchase: { label: 'Achat', variant: 'default' as const, isPositive: true },
  payment: {
    label: 'Paiement',
    variant: 'secondary' as const,
    isPositive: false
  },
  refund: {
    label: 'Remboursement',
    variant: 'outline' as const,
    isPositive: true
  },
  expiration: {
    label: 'Expiration',
    variant: 'destructive' as const,
    isPositive: false
  }
} satisfies Record<
  WalletTransaction['type'],
  {
    label: string
    variant: 'default' | 'secondary' | 'outline' | 'destructive'
    isPositive: boolean
  }
>

export const CreditsTabSkeleton = () => {
  return (
    <div className="space-y-6">
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
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export const CreditsTab = () => {
  const balanceQuery = useSuspenseQuery(getUserBalanceQueryOpts())
  const expiringQuery = useSuspenseQuery(getNextExpiringCreditsQueryOpts())
  const transactionsQuery = useSuspenseQuery(getWalletTransactionsQueryOpts())

  const daysUntilExpiration =
    expiringQuery.data !== null
      ? differenceInDays(expiringQuery.data.expiresAt, nowParis())
      : null
  const shouldShowWarning =
    daysUntilExpiration !== null &&
    daysUntilExpiration <= EXPIRATION_WARNING_DAYS

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-lg border p-6">
        <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <WalletIcon className="size-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Solde actuel</p>
              <p className="font-display text-2xl font-bold">
                {formatCentsToEuros(balanceQuery.data)}
              </p>
            </div>
          </div>
          <Button asChild className="w-full xs:w-auto">
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
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Historique</h3>
        {transactionsQuery.data.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            Aucune transaction pour le moment
          </p>
        ) : (
          <ul className="space-y-2" aria-label="Historique des transactions">
            {transactionsQuery.data.map((transaction) => {
              const config = TRANSACTION_TYPE_CONFIG[transaction.type]
              const isPositive = transaction.amountCents > 0

              return (
                <li
                  key={transaction.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex size-8 items-center justify-center rounded-full',
                        isPositive ? 'bg-green-500/10' : 'bg-red-500/10'
                      )}
                    >
                      {isPositive ? (
                        <ArrowUpIcon
                          className="size-4 text-green-600"
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowDownIcon
                          className="size-4 text-red-600"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={config.variant}>{config.label}</Badge>
                        {transaction.creditPack ? (
                          <span className="text-sm text-muted-foreground">
                            Pack {transaction.creditPack.name}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDateFr(transaction.createdAt)}
                        {transaction.expiresAt ? (
                          <>
                            {' '}
                            · Expire le {formatDateFr(transaction.expiresAt)}
                          </>
                        ) : null}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        'font-medium',
                        isPositive ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {isPositive ? '+' : ''}
                      {formatCentsToEuros(transaction.amountCents)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Solde: {formatCentsToEuros(transaction.balanceAfterCents)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
