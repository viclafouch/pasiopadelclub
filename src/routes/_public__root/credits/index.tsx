import { CheckIcon, Crown, GiftIcon, WalletIcon } from 'lucide-react'
import { BookingCta } from '@/components/booking-cta'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { formatCentsToEuros } from '@/helpers/number'
import { cn } from '@/lib/utils'
import { seo } from '@/utils/seo'
import { createFileRoute, Link } from '@tanstack/react-router'

type StaticCreditPack = {
  name: string
  priceCents: number
  creditsCents: number
  validityMonths: number
}

const CREDIT_PACKS = [
  {
    name: 'Starter',
    priceCents: 15_000,
    creditsCents: 16_000,
    validityMonths: 6
  },
  { name: 'Pro', priceCents: 30_000, creditsCents: 33_000, validityMonths: 9 },
  {
    name: 'Premium',
    priceCents: 50_000,
    creditsCents: 57_500,
    validityMonths: 12
  }
] as const satisfies StaticCreditPack[]

const POPULAR_PACK_NAME = 'Pro'

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
  pack: StaticCreditPack
  isPopular: boolean
}

const CreditPackCard = ({ pack, isPopular }: CreditPackCardProps) => {
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
          <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-primary/[0.07] blur-2xl transition-colors duration-500 group-hover:bg-primary/15" />
          <div className="absolute -bottom-12 -right-12 h-28 w-28 rounded-full bg-primary/[0.06] blur-2xl transition-colors duration-500 group-hover:bg-primary/20" />
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
          <h2
            className={cn(
              'font-display text-2xl font-bold',
              isPopular ? 'text-white' : 'text-foreground'
            )}
          >
            Pack {pack.name}
          </h2>
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
                'font-display text-5xl font-bold tracking-tight tabular-nums',
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
              <span className="font-semibold tabular-nums">
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
          <Button
            asChild
            size="lg"
            className={cn(
              'w-full',
              isPopular && 'bg-white text-primary hover:bg-white/90'
            )}
            variant={isPopular ? 'secondary' : 'default'}
          >
            <Link to="/application">Acheter sur l&apos;app</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

const CreditsPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="section-py">
        <div className="container space-y-16">
          <PageHeader
            title="Packs de crédits"
            description="Économisez sur vos réservations avec nos packs de crédits. Plus vous achetez, plus vous gagnez."
          />
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="grid gap-6 lg:grid-cols-3 lg:items-center">
              {CREDIT_PACKS.map((pack) => {
                return (
                  <CreditPackCard
                    key={pack.name}
                    pack={pack}
                    isPopular={pack.name === POPULAR_PACK_NAME}
                  />
                )
              })}
            </div>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">
              Crédits valables sur{' '}
              <span className="font-semibold text-foreground">
                tous les terrains
              </span>
              , remboursés en cas d&apos;annulation
            </p>
          </div>
        </div>
      </section>
      <BookingCta
        eyebrow="Pas de crédits ? Pas de problème"
        title="Pas encore convaincu ?"
        description="Réservez directement un terrain via l'application mobile. Simple, flexible, sans engagement."
      />
    </main>
  )
}

export const Route = createFileRoute('/_public__root/credits/')({
  staleTime: Infinity,
  component: CreditsPage,
  head: () => {
    return seo({
      title: 'Packs de crédits',
      description:
        'Achetez des packs de crédits et économisez sur vos réservations de padel. Bonus exclusifs sur nos packs Starter, Pro et Premium.',
      keywords:
        'pack crédits padel, abonnement padel bayonne, forfait padel pays basque, réduction padel',
      pathname: '/credits',
      image: '/images/og-image.webp',
      imageAlt:
        'Packs de crédits Pasio Padel Club - Économisez sur vos réservations'
    })
  }
})
