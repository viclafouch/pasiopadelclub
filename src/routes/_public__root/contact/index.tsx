import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { CLUB_INFO } from '@/constants/app'
import { seo } from '@/utils/seo'
import { createFileRoute, Link } from '@tanstack/react-router'

const ContactPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="section-py relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="container relative">
          <PageHeader
            title="Contactez-nous"
            description="Une question sur nos terrains ou nos services ? N'hésitez pas à nous contacter."
          />
        </div>
      </section>
      <section className="section-pb">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Informations
                </h2>
                <div className="space-y-4">
                  <a
                    href={CLUB_INFO.phone.href}
                    className="flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-accent"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Phone
                        className="size-5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Téléphone</p>
                      <p className="text-muted-foreground">
                        {CLUB_INFO.phone.display}
                      </p>
                    </div>
                  </a>
                  <a
                    href={`mailto:${CLUB_INFO.email}`}
                    className="flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-accent"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Mail
                        className="size-5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-muted-foreground">{CLUB_INFO.email}</p>
                    </div>
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLUB_INFO.address.full)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-accent"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin
                        className="size-5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Adresse</p>
                      <p className="text-muted-foreground">
                        {CLUB_INFO.address.street},{' '}
                        {CLUB_INFO.address.postalCode} {CLUB_INFO.address.city}
                      </p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4 rounded-xl border p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Clock
                        className="size-5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Horaires</p>
                      <p className="text-muted-foreground">
                        {CLUB_INFO.hours.days} de {CLUB_INFO.hours.open}00 à{' '}
                        {CLUB_INFO.hours.close}00
                      </p>
                    </div>
                  </div>
                </div>
                <Button asChild size="lg" className="w-full">
                  <Link to="/application">Réserver sur l&apos;app</Link>
                </Button>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border/50 md:min-h-[400px]">
                <iframe
                  src={CLUB_INFO.address.googleMapsUrl}
                  width="100%"
                  height="100%"
                  style={{ minHeight: '400px' }}
                  allowFullScreen
                  title={`${CLUB_INFO.name} - Localisation`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export const Route = createFileRoute('/_public__root/contact/')({
  component: ContactPage,
  head: () => {
    return seo({
      title: 'Contact',
      description: `Contactez ${CLUB_INFO.name} à ${CLUB_INFO.address.city}. Adresse : ${CLUB_INFO.address.full}. Téléphone : ${CLUB_INFO.phone.display}. Ouvert 7j/7 de ${CLUB_INFO.hours.open} à ${CLUB_INFO.hours.close}.`,
      keywords:
        'contact padel bayonne, téléphone club padel, adresse pasio padel, horaires padel bayonne',
      pathname: '/contact'
    })
  }
})
