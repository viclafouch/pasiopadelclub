import { CreditCardIcon, LoaderIcon, WalletIcon } from 'lucide-react'
import { formatCentsToEuros } from '@/helpers/number'
import { cn } from '@/lib/utils'
import type { UseQueryResult } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import type { PaymentMethod } from './constants'

type BalanceQueryResult = UseQueryResult<number>

type PaymentMethodSelectorProps = {
  selectedMethod: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
  balanceQuery: BalanceQueryResult
  courtPrice: number
  isDisabled: boolean
}

export const PaymentMethodSelector = ({
  selectedMethod,
  onMethodChange,
  balanceQuery,
  courtPrice,
  isDisabled
}: PaymentMethodSelectorProps) => {
  const hasEnoughCredits = (balanceQuery.data ?? 0) >= courtPrice
  const canSelectCredit = hasEnoughCredits && !balanceQuery.isError

  const handleMethodChange = (method: PaymentMethod) => {
    if (method === 'credit' && !canSelectCredit) {
      return
    }

    onMethodChange(method)
  }

  const getCreditButtonLabel = () => {
    if (balanceQuery.isPending) {
      return 'Chargement...'
    }

    if (balanceQuery.isError) {
      return 'Crédits indisponibles'
    }

    return `Crédits (${formatCentsToEuros(balanceQuery.data ?? 0)})`
  }

  const getCreditDescribedBy = () => {
    if (balanceQuery.isError) {
      return 'credits-error'
    }

    if (!hasEnoughCredits) {
      return 'credits-insufficient'
    }

    return ''
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">Mode de paiement</legend>
      <div
        role="radiogroup"
        aria-label="Mode de paiement"
        className="grid gap-2 sm:grid-cols-2"
      >
        <button
          type="button"
          role="radio"
          aria-checked={selectedMethod === 'card'}
          onClick={() => {
            return handleMethodChange('card')
          }}
          disabled={isDisabled}
          className={cn(
            'flex items-center gap-2 rounded-lg border-2 p-3 transition-colors',
            selectedMethod === 'card'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          )}
        >
          <CreditCardIcon
            className={cn(
              'size-5',
              selectedMethod === 'card'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
            aria-hidden="true"
          />
          <span className="text-sm font-medium">Carte bancaire</span>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={selectedMethod === 'credit'}
          aria-describedby={getCreditDescribedBy()}
          onClick={() => {
            return handleMethodChange('credit')
          }}
          disabled={isDisabled || balanceQuery.isError}
          className={cn(
            'flex items-center gap-2 rounded-lg border-2 p-3 transition-colors',
            selectedMethod === 'credit'
              ? 'border-primary bg-primary/5'
              : 'border-border',
            canSelectCredit ? 'hover:border-primary/50' : 'opacity-50'
          )}
        >
          {balanceQuery.isPending ? (
            <LoaderIcon
              className="size-5 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          ) : (
            <WalletIcon
              className={cn(
                'size-5',
                selectedMethod === 'credit'
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
              aria-hidden="true"
            />
          )}
          <span className="text-sm font-medium">{getCreditButtonLabel()}</span>
        </button>
      </div>
      {balanceQuery.isError ? (
        <p id="credits-error" role="alert" className="text-xs text-destructive">
          Impossible de charger vos crédits. Utilisez la carte bancaire.
        </p>
      ) : !hasEnoughCredits ? (
        <p id="credits-insufficient" className="text-xs text-muted-foreground">
          {(balanceQuery.data ?? 0) > 0
            ? 'Solde insuffisant.'
            : 'Aucun crédit disponible.'}{' '}
          <Link
            to="/credits"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            Acheter des crédits
          </Link>
        </p>
      ) : null}
    </fieldset>
  )
}
