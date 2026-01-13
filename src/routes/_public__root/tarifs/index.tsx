import { Clock, Info, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { LOCATION_LABELS } from '@/constants/court'
import { seo } from '@/utils/seo'
import { createFileRoute, Link } from '@tanstack/react-router'

type Location = keyof typeof LOCATION_LABELS

const getFeaturedClass = (
  isFeatured: boolean,
  featured: string,
  normal: string
) => {
  return isFeatured ? featured : normal
}

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
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${getFeaturedClass(isFeatured, 'bg-white/20', 'bg-primary/10')}`}
      >
        {icon}
      </div>
      <div>
        <p
          className={`font-medium ${getFeaturedClass(isFeatured, 'text-white', 'text-foreground')}`}
        >
          {label}
        </p>
        <p
          className={`text-sm ${getFeaturedClass(isFeatured, 'text-white/70', 'text-muted-foreground')}`}
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
      className={`mb-8 rounded-2xl p-4 ${getFeaturedClass(isFeatured, 'bg-white/10', 'bg-muted/50')}`}
    >
      <p
        className={`mb-2 text-xs font-medium uppercase tracking-wider ${getFeaturedClass(isFeatured, 'text-white/70', 'text-muted-foreground')}`}
      >
        Terrains disponibles
      </p>
      <div className="flex flex-wrap gap-2">
        {courts.map((court) => {
          return (
            <span
              key={court}
              className={`rounded-full px-3 py-1 text-sm font-medium ${getFeaturedClass(isFeatured, 'bg-white/20 text-white', 'bg-background text-foreground')}`}
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
  location: Location
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
  const cardClassName = getFeaturedClass(
    isFeatured,
    'z-10 scale-100 border-primary/30 bg-gradient-to-b from-primary to-primary/90 text-white shadow-2xl shadow-primary/25 lg:scale-105',
    'border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5'
  )
  const iconClassName = getFeaturedClass(
    isFeatured,
    'text-white',
    'text-primary'
  )

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-3xl border transition-all duration-500 ${cardClassName}`}
    >
      {isFeatured ? (
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      ) : null}
      {isFeatured ? (
        <div className="absolute top-0 right-0 left-0 bg-white/10 py-2 text-center text-xs font-semibold uppercase tracking-widest">
          Le plus populaire
        </div>
      ) : null}
      <div className={`flex flex-1 flex-col p-8 ${isFeatured ? 'pt-14' : ''}`}>
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <h3
              className={`font-display text-2xl font-bold ${getFeaturedClass(isFeatured, 'text-white', 'text-foreground')}`}
            >
              {title}
            </h3>
            {tooltip ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    className={`h-4 w-4 cursor-help ${getFeaturedClass(isFeatured, 'text-white/70', 'text-muted-foreground')}`}
                    aria-hidden="true"
                  />
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            ) : null}
          </div>
          <p
            className={`text-sm ${getFeaturedClass(isFeatured, 'text-white/80', 'text-muted-foreground')}`}
          >
            {LOCATION_LABELS[location]}
          </p>
        </div>
        <div className="mb-8">
          <div className="flex items-baseline gap-1">
            <span
              className={`font-display text-5xl font-bold tracking-tight ${getFeaturedClass(isFeatured, 'text-white', 'text-foreground')}`}
            >
              {price}€
            </span>
            <span
              className={`text-lg ${getFeaturedClass(isFeatured, 'text-white/70', 'text-muted-foreground')}`}
            >
              / séance
            </span>
          </div>
        </div>
        <div className="mb-8 space-y-4">
          <FeatureRow
            icon={
              <Clock
                className={`h-5 w-5 ${iconClassName}`}
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
                className={`h-5 w-5 ${iconClassName}`}
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
            className={`w-full ${isFeatured ? 'bg-white text-primary hover:bg-white/90' : ''}`}
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
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 right-1/4 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] translate-y-1/2 rounded-full bg-primary/3 blur-3xl" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Nos Tarifs
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Des terrains de qualité professionnelle accessibles à tous.
              Choisissez la formule qui vous convient.
            </p>
          </div>
        </div>
      </section>
      <section className="pb-20 lg:pb-28">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3 lg:items-center">
            <PricingCard
              title="Simple"
              price={30}
              duration={60}
              players={2}
              courts={['Simple']}
              location="indoor"
            />
            <PricingCard
              title="Double"
              price={60}
              duration={90}
              players={4}
              courts={['Double A', 'Double B', 'Double C', 'Double D']}
              location="both"
              isFeatured
            />
            <PricingCard
              title="Kids"
              price={15}
              duration={60}
              players={2}
              courts={['Kids']}
              location="indoor"
              tooltip="Ouvert à tous"
            />
          </div>
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              Tous les terrains sont disponibles de{' '}
              <span className="font-semibold text-primary">8h à 22h</span>,{' '}
              <span className="font-semibold text-foreground">
                7 jours sur 7
              </span>
            </p>
          </div>
        </div>
      </section>
      <section className="border-t border-border/50 bg-muted/30 py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Prêt à jouer ?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Réservez votre créneau en quelques clics et profitez de nos
              installations.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to="/reservation">Réserver un terrain</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

export const Route = createFileRoute('/_public__root/tarifs/')({
  component: TarifsPage,
  head: () => {
    return {
      meta: seo({
        title: 'Tarifs',
        description:
          'Découvrez les tarifs de Pasio Padel Club à Anglet : terrains Double (60€/90min), Simple (30€/60min) et Kids (15€/60min). Réservez en ligne 7j/7.',
        pathname: '/tarifs'
      })
    }
  }
})
