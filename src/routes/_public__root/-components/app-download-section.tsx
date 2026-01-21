import { PhoneMockup } from '@/components/app/phone-mockup'
import { QRCode } from '@/components/app/qr-code'
import { StoreBadge } from '@/components/app/store-badge'

export const AppDownloadSection = () => {
  return (
    <section className="section-py relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 size-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 size-[400px] rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="hidden justify-center lg:order-1 lg:flex">
            <PhoneMockup />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="mb-4 font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              L&apos;appli Pasio
              <br />
              <span className="text-primary">dans votre poche</span>
            </h2>
            <p className="mb-8 max-w-md text-lg text-muted-foreground">
              Réservez vos terrains, gérez vos matchs et recevez des rappels.
              Tout ça en quelques secondes.
            </p>
            <div className="desktop-only flex flex-col items-start gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Scannez pour télécharger
                </span>
                <QRCode className="rounded-2xl p-3 shadow-lg" />
              </div>
              <div className="flex flex-wrap gap-3">
                <StoreBadge store="apple" />
                <StoreBadge store="google" />
              </div>
            </div>
            <div className="mobile-only flex flex-col gap-3 sm:flex-row">
              <StoreBadge store="apple" className="ios-first" />
              <StoreBadge store="google" className="android-first" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
