import { CheckIcon, Crown, GiftIcon, WalletIcon } from 'lucide-react'
import type { CreditPack } from '@/constants/types'
import { formatCentsToEuros } from '@/helpers/number'
import { cn } from '@/lib/utils'
import { LoadingButton } from './loading-button'

type FeatureCheckProps = {
  label: string
  isPopular: boolean
}

const FeatureCheck = ({ label, isPopular }: FeatureCheckProps) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <CheckIcon
        className={cn('size-4', isPopular ? 'text-white' : 'text-primary')}
        aria-hidden="true"
      />
      <span className={isPopular ? 'text-white/90' : ''}>{label}</span>
    </div>
  )
}

type CreditsSummaryProps = {
  creditsCents: number
  isPopular: boolean
}

const CreditsSummary = ({ creditsCents, isPopular }: CreditsSummaryProps) => {
  return (
    <div
      className={cn(
        'mb-8 rounded-2xl p-4',
        isPopular ? 'bg-white/10' : 'bg-muted/50'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-xl',
            isPopular ? 'bg-white/20' : 'bg-primary/10'
          )}
        >
          <WalletIcon
            className={cn('size-5', isPopular ? 'text-white' : 'text-primary')}
            aria-hidden="true"
          />
        </div>
        <div>
          <p
            className={cn(
              'font-medium',
              isPopular ? 'text-white' : 'text-foreground'
            )}
          >
            {formatCentsToEuros(creditsCents, { minimumFractionDigits: 0 })} de
            crédits
          </p>
          <p
            className={cn(
              'text-sm',
              isPopular ? 'text-white/70' : 'text-muted-foreground'
            )}
          >
            À utiliser sur tous les terrains
          </p>
        </div>
      </div>
    </div>
  )
}

type CreditPackCardProps = {
  pack: CreditPack
  isPopular?: boolean
  isPending: boolean
  onPurchase: () => void
}

export const CreditPackCard = ({
  pack,
  isPopular = false,
  isPending,
  onPurchase
}: CreditPackCardProps) => {
  const bonusCents = pack.creditsCents - pack.priceCents

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-3xl border transition-all duration-500',
        isPopular
          ? 'z-10 scale-100 border-primary/30 bg-gradient-to-br from-primary via-primary to-primary/85 text-white shadow-2xl shadow-primary/25 lg:scale-105'
          : 'border-border/60 bg-gradient-to-br from-card via-card to-primary/[0.02] shadow-lg shadow-primary/5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/15 hover:-translate-y-1'
      )}
    >
      {isPopular ? (
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      ) : (
        <>
          <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-primary/[0.07] blur-2xl transition-all duration-500 group-hover:bg-primary/15" />
          <div className="absolute -bottom-12 -right-12 h-28 w-28 rounded-full bg-primary/[0.06] blur-2xl transition-all duration-500 group-hover:bg-primary/20" />
        </>
      )}
      {isPopular ? (
        <div className="absolute top-0 right-0 left-0 flex items-center justify-center gap-1.5 bg-white/10 py-2 text-xs font-semibold uppercase tracking-widest">
          <Crown className="size-3.5 text-yellow-400" aria-hidden="true" />
          Le plus populaire
        </div>
      ) : null}
      <div className={cn('flex flex-1 flex-col p-8', isPopular && 'pt-14')}>
        <div className="mb-6">
          <h3
            className={cn(
              'font-display text-2xl font-bold',
              isPopular ? 'text-white' : 'text-foreground'
            )}
          >
            Pack {pack.name}
          </h3>
          <p
            className={cn(
              'text-sm',
              isPopular ? 'text-white/80' : 'text-muted-foreground'
            )}
          >
            Validité {pack.validityMonths} mois
          </p>
        </div>
        <div className="mb-8">
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                'font-display text-5xl font-bold tracking-tight',
                isPopular ? 'text-white' : 'text-foreground'
              )}
            >
              {formatCentsToEuros(pack.priceCents, {
                minimumFractionDigits: 0
              })}
            </span>
          </div>
          {bonusCents > 0 ? (
            <div
              className={cn(
                'mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium',
                isPopular
                  ? 'bg-white/15 text-white/90'
                  : 'bg-green-500/10 text-green-600'
              )}
            >
              <GiftIcon className="size-4" aria-hidden="true" />
              <span className="font-semibold">
                +{formatCentsToEuros(bonusCents, { minimumFractionDigits: 0 })}{' '}
                offerts
              </span>
            </div>
          ) : null}
        </div>
        <CreditsSummary
          creditsCents={pack.creditsCents}
          isPopular={isPopular}
        />
        <div className="mb-8 space-y-3">
          <FeatureCheck label="Paiement instantané" isPopular={isPopular} />
          <FeatureCheck
            label="Annulation remboursée en crédits"
            isPopular={isPopular}
          />
        </div>
        <div className="mt-auto">
          <LoadingButton
            onClick={onPurchase}
            isLoading={isPending}
            size="lg"
            className={cn(
              'w-full',
              isPopular && 'bg-white text-primary hover:bg-white/90'
            )}
            variant={isPopular ? 'secondary' : 'default'}
          >
            Acheter
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}
