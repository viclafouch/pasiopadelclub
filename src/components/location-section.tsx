export const LocationSection = () => {
  return (
    <section className="bg-muted/50 py-16 lg:py-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Pasio Padel Club
            </h2>
            <p className="text-xl lg:text-2xl font-semibold text-foreground mb-6">
              20 rue Alfred de Vigny, 64600 Anglet
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8">
              <a
                href="tel:+33971117928"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                09 71 11 79 28
              </a>
              <a
                href="mailto:contact@pasiopadelclub.fr"
                className="text-primary hover:underline font-medium"
              >
                contact@pasiopadelclub.fr
              </a>
            </div>
            <p className="text-muted-foreground mb-10 max-w-lg">
              Au cœur d&apos;Anglet, Pasio Padel Club vous accueille tous les
              jours de 8h à 22h pour des sessions de padel dans une ambiance
              conviviale.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-8">
                <span className="text-foreground font-medium w-48">
                  Lundi — Dimanche
                </span>
                <span className="text-primary font-semibold">8h00 — 22h00</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden h-[400px] lg:h-[500px] shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2894.5398318655325!2d-1.4963219237594685!3d43.49107286290169!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd514182cba36089%3A0xe20604785805f73!2sPASIO%20PADEL%20CLUB!5e0!3m2!1sfr!2sfr!4v1767289561820!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              title="Pasio Padel Club"
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
