import { CLUB_INFO } from '@/constants/app'

export const LocationSection = () => {
  return (
    <section className="bg-muted/50 py-16 lg:py-24">
      <div className="container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="mb-2 font-display text-xl font-bold text-foreground lg:text-2xl">
              {CLUB_INFO.name}
            </h2>
            <p className="mb-6 text-xl font-semibold text-foreground lg:text-2xl">
              {CLUB_INFO.address.full}
            </p>
            <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <a
                href={CLUB_INFO.phone.href}
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                {CLUB_INFO.phone.display}
              </a>
              <a
                href={`mailto:${CLUB_INFO.email}`}
                className="font-medium text-primary hover:underline"
              >
                {CLUB_INFO.email}
              </a>
            </div>
            <p className="mb-10 max-w-lg text-muted-foreground">
              Au cœur de Bayonne, {CLUB_INFO.name} vous accueille{' '}
              {CLUB_INFO.hours.days.toLowerCase()} de {CLUB_INFO.hours.open} à{' '}
              {CLUB_INFO.hours.close} pour des sessions de padel dans une
              ambiance conviviale.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-8">
                <span className="w-48 font-medium text-foreground">
                  Lundi — Dimanche
                </span>
                <span className="font-semibold text-primary">
                  {CLUB_INFO.hours.open}00 — {CLUB_INFO.hours.close}00
                </span>
              </div>
            </div>
          </div>
          <div className="h-[400px] overflow-hidden rounded-xl shadow-lg lg:h-[500px]">
            <iframe
              src={CLUB_INFO.address.googleMapsUrl}
              width="100%"
              height="100%"
              title={CLUB_INFO.name}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
