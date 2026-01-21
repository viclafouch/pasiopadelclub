import { Clock, Crown, Info, Users } from 'lucide-react'
import { BookingCta } from '@/components/booking-cta'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { CLUB_INFO } from '@/constants/app'
import { LOCATION_LABELS } from '@/constants/court'
import { formatCentsToEuros } from '@/helpers/number'
import { cn } from '@/lib/utils'
import { seo } from '@/utils/seo'
import { createFileRoute, Link } from '@tanstack/react-router'

type FeatureRowProps = {
  icon: React.ReactNode
  label: string
  sublabel: string
  isFeatured: boolean
}

const FeatureRow = ({ icon, label, sublabel, isFeatured }: FeatureRowProps) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-xl',
          isFeatured ? 'bg-white/20' : 'bg-primary/10'
        )}
      >
        {icon}
      </div>
      <div>
        <p
          className={cn(
            'font-medium',
            isFeatured ? 'text-white' : 'text-foreground'
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            'text-sm',
            isFeatured ? 'text-white/70' : 'text-muted-foreground'
          )}
        >
          {sublabel}
        </p>
      </div>
    </div>
  )
}

type CourtsListProps = {
  courts: string[]
  isFeatured: boolean
}

const CourtsList = ({ courts, isFeatured }: CourtsListProps) => {
  return (
    <div
      className={cn(
        'mb-8 rounded-2xl p-4',
        isFeatured ? 'bg-white/10' : 'bg-muted/50'
      )}
    >
      <p
        className={cn(
          'mb-2 text-xs font-medium uppercase tracking-wider',
          isFeatured ? 'text-white/70' : 'text-muted-foreground'
        )}
      >
        Terrains disponibles
      </p>
      <div className="flex flex-wrap gap-2">
        {courts.map((court) => {
          return (
            <span
              key={court}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium',
                isFeatured
                  ? 'bg-white/20 text-white'
                  : 'bg-background text-foreground'
              )}
            >
              {court}
            </span>
          )
        })}
      </div>
    </div>
  )
}

type PricingCardProps = {
  title: string
  price: number
  duration: number
  players: number
  courts: string[]
  location: keyof typeof LOCATION_LABELS
  isFeatured?: boolean
  tooltip?: string
}

const PricingCard = ({
  title,
  price,
  duration,
  players,
  courts,
  location,
  isFeatured = false,
  tooltip
}: PricingCardProps) => {
  const iconClassName = isFeatured ? 'text-white' : 'text-primary'

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-3xl border transition-all duration-500',
        isFeatured
          ? 'z-10 scale-100 border-primary/30 bg-gradient-to-br from-primary via-primary to-primary/85 text-white shadow-2xl shadow-primary/25 lg:scale-105'
          : 'border-border/60 bg-gradient-to-br from-card via-card to-primary/[0.02] shadow-lg shadow-primary/5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/15 hover:-translate-y-1'
      )}
    >
      {isFeatured ? (
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      ) : (
        <>
          <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-primary/[0.07] blur-2xl transition-all duration-500 group-hover:bg-primary/15" />
          <div className="absolute -bottom-12 -right-12 h-28 w-28 rounded-full bg-primary/[0.06] blur-2xl transition-all duration-500 group-hover:bg-primary/20" />
        </>
      )}
      {isFeatured ? (
        <div className="absolute top-0 right-0 left-0 flex items-center justify-center gap-1.5 bg-white/10 py-2 text-xs font-semibold uppercase tracking-widest">
          <Crown className="size-3.5 text-yellow-400" aria-hidden="true" />
          Le plus populaire
        </div>
      ) : null}
      <div className={cn('flex flex-1 flex-col p-8', isFeatured && 'pt-14')}>
        <div className="mb-6">
          <div className="mb-0.5 flex items-center gap-2">
            <h3
              className={cn(
                'font-display text-2xl font-bold',
                isFeatured ? 'text-white' : 'text-foreground'
              )}
            >
              {title}
            </h3>
            {tooltip ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    className={cn(
                      'size-4 cursor-help',
                      isFeatured ? 'text-white/70' : 'text-muted-foreground'
                    )}
                    aria-hidden="true"
                  />
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            ) : null}
          </div>
          <p
            className={cn(
              'text-sm',
              isFeatured ? 'text-white/80' : 'text-muted-foreground'
            )}
          >
            {LOCATION_LABELS[location]}
          </p>
        </div>
        <div className="mb-8">
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                'font-display text-5xl font-bold tracking-tight',
                isFeatured ? 'text-white' : 'text-foreground'
              )}
            >
              {formatCentsToEuros(price, { minimumFractionDigits: 0 })}
            </span>
            <span
              className={cn(
                'text-lg',
                isFeatured ? 'text-white/70' : 'text-muted-foreground'
              )}
            >
              / séance
            </span>
          </div>
          <div
            className={cn(
              'mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium',
              isFeatured
                ? 'bg-white/15 text-white/90'
                : 'bg-primary/10 text-primary'
            )}
          >
            <span className="font-semibold">
              {formatCentsToEuros(price / players, {
                minimumFractionDigits: 0
              })}
            </span>
            <span className={isFeatured ? 'text-white/70' : 'text-primary/70'}>
              par joueur
            </span>
          </div>
        </div>
        <div className="mb-8 space-y-4">
          <FeatureRow
            icon={
              <Clock
                className={cn('size-5', iconClassName)}
                aria-hidden="true"
              />
            }
            label={`${duration} minutes`}
            sublabel="Durée de la session"
            isFeatured={isFeatured}
          />
          <FeatureRow
            icon={
              <Users
                className={cn('size-5', iconClassName)}
                aria-hidden="true"
              />
            }
            label={`${players} joueurs`}
            sublabel="Capacité du terrain"
            isFeatured={isFeatured}
          />
        </div>
        <CourtsList courts={courts} isFeatured={isFeatured} />
        <div className="mt-auto">
          <Button
            asChild
            size="lg"
            className={cn(
              'w-full',
              isFeatured && 'bg-white text-primary hover:bg-white/90'
            )}
            variant={isFeatured ? 'secondary' : 'default'}
          >
            <Link to="/reservation">Réserver</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

const TarifsPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="section-py">
        <div className="container space-y-16">
          <PageHeader
            title="Nos Tarifs"
            description="Des terrains de qualité professionnelle accessibles à tous. Choisissez la formule qui vous convient."
          />
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3 lg:items-center">
            <PricingCard
              title="Simple"
              price={3000}
              duration={60}
              players={2}
              courts={['Simple N°1', 'Simple Initiation']}
              location="indoor"
            />
            <PricingCard
              title="Double"
              price={6000}
              duration={90}
              players={4}
              courts={['Double A', 'Double B', 'Double C', 'Double D']}
              location="both"
              isFeatured
            />
            <PricingCard
              title="Kids"
              price={1500}
              duration={60}
              players={2}
              courts={['Kids']}
              location="indoor"
              tooltip="Ouvert à tous"
            />
          </div>
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Tous les terrains sont disponibles de{' '}
              <span className="font-semibold text-primary">8h à 22h</span>,{' '}
              <span className="font-semibold text-foreground">
                7 jours sur 7
              </span>
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">
                Location de matériel :
              </span>{' '}
              raquettes à 3€, accessoires et boîtes de balles disponibles sur
              place.
            </p>
          </div>
        </div>
      </section>
      <BookingCta
        title="Prêt à jouer ?"
        description="Réservez votre créneau en quelques clics et profitez de nos installations."
      />
    </main>
  )
}

export const Route = createFileRoute('/_public__root/tarifs/')({
  component: TarifsPage,
  head: () => {
    return {
      ...seo({
        title: 'Tarifs',
        description: `Découvrez les tarifs de ${CLUB_INFO.name} à ${CLUB_INFO.address.city} : terrains Double (60€/90min), Simple (30€/60min) et Kids (15€/60min). Location de raquettes à 3€. Réservez en ligne 7j/7.`,
        keywords:
          'tarif padel bayonne, prix location terrain padel, padel pas cher pays basque, tarif court padel 64',
        pathname: '/tarifs'
      })
    }
  }
})
