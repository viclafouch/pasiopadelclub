import type { LucideIcon } from 'lucide-react'
import { BellIcon, CalendarIcon, ClockIcon, CreditCardIcon } from 'lucide-react'
import { PhoneMockup } from '@/components/app/phone-mockup'
import { QRCode } from '@/components/app/qr-code'
import { StoreBadge } from '@/components/app/store-badge'
import { APP_FEATURES } from '@/constants/app'
import { seo } from '@/utils/seo'
import { createFileRoute } from '@tanstack/react-router'

const FEATURE_ICONS = [
  CalendarIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon
] as const satisfies LucideIcon[]

type FeatureCardProps = {
  icon: LucideIcon
  title: string
  description: string
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group rounded-2xl border border-border/50 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
        <Icon className="size-6 text-primary" />
      </div>
      <h3 className="mb-2 font-display text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

const ApplicationPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-1/3 -right-1/4 size-[800px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-1/3 -left-1/4 size-[600px] rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="container relative">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                Nouvelle application
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Réservez vos matchs
                <br />
                <span className="text-primary">en un instant</span>
              </h1>
              <p className="mb-10 max-w-lg text-lg text-muted-foreground">
                L&apos;application Pasio Padel Club vous permet de réserver vos
                terrains, gérer vos matchs et suivre votre historique. Tout ça
                depuis votre smartphone.
              </p>
              <div className="desktop-only flex flex-col gap-6">
                <div className="flex flex-wrap gap-4">
                  <StoreBadge store="apple" size="large" />
                  <StoreBadge store="google" size="large" />
                </div>
                <div className="flex items-center gap-4">
                  <QRCode size="small" />
                  <p className="max-w-[180px] text-sm text-muted-foreground">
                    Ou scannez le QR code avec votre téléphone
                  </p>
                </div>
              </div>
              <div className="mobile-only flex flex-wrap gap-4">
                <StoreBadge store="apple" size="large" className="ios-first" />
                <StoreBadge
                  store="google"
                  size="large"
                  className="android-first"
                />
              </div>
            </div>
            <div className="hidden justify-center lg:flex">
              <PhoneMockup size="large" />
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-border/50 bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Tout pour vos matchs
            </h2>
            <p className="text-muted-foreground">
              Une application pensée pour les joueurs de padel
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            {APP_FEATURES.map((feature, index) => {
              const Icon = FEATURE_ICONS[index]

              return Icon ? (
                <FeatureCard
                  key={feature.title}
                  icon={Icon}
                  title={feature.title}
                  description={feature.description}
                />
              ) : null
            })}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Prêt à jouer ?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Téléchargez l&apos;application et réservez votre premier match
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <StoreBadge store="apple" size="large" className="ios-first" />
              <StoreBadge
                store="google"
                size="large"
                className="android-first"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export const Route = createFileRoute('/_public__root/application/')({
  component: ApplicationPage,
  head: () => {
    return {
      meta: seo({
        title: 'Application mobile',
        description:
          "Téléchargez l'application Pasio Padel Club pour réserver vos terrains de padel en quelques secondes. Disponible sur iOS et Android.",
        pathname: '/application'
      })
    }
  }
})
