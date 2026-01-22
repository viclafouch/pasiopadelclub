import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

type BookingCtaProps = {
  eyebrow?: string
  title: string
  description: string
}

export const BookingCta = ({
  eyebrow,
  title,
  description
}: BookingCtaProps) => {
  return (
    <section className="relative isolate overflow-hidden bg-neutral">
      <picture>
        <source srcSet="/images/terrain.webp" type="image/webp" />
        <img
          src="/images/terrain.jpg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
      </picture>
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral/90 via-neutral/70 to-neutral/90 md:bg-gradient-to-r md:from-neutral/80 md:via-neutral/60 md:to-neutral/80"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-1/3 bg-gradient-to-b from-primary/20 to-transparent"
        aria-hidden="true"
      />
      <div className="container section-py">
        <div className="mx-auto max-w-4xl text-center">
          {eyebrow ? (
            <p className="font-display text-sm font-medium uppercase tracking-widest text-primary-foreground/70">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl lg:text-5xl text-balance">
            {title}
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80 md:text-xl">
            {description}
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-primary-foreground text-neutral shadow-lg hover:bg-primary-foreground/90"
          >
            <Link to="/reservation" preload="render">
              Réserver un terrain
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
