import { StarRating } from '@/components/star-rating'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export const Hero = () => {
  return (
    <section className="relative flex min-h-svh items-center justify-center">
      <img
        src="https://images.pexels.com/photos/32474981/pexels-photo-32474981.jpeg"
        alt="Terrain de padel professionnel"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/70" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <a
          href="https://share.google/VojA0UjurnBiWWZZk"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 flex justify-center"
        >
          <StarRating rating={5} />
        </a>
        <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
          Votre club de padel
          <br />
          <span className="text-primary">à Pasio</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80 md:text-xl">
          Découvrez nos terrains de qualité professionnelle et vivez une
          expérience unique de padel dans un cadre exceptionnel.
        </p>
        <Button size="lg" variant="default" asChild>
          <Link to="/reservation">Réserver un terrain</Link>
        </Button>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-widest">Découvrir</span>
          <div className="h-12 w-px animate-pulse bg-linear-to-b from-white/60 to-transparent" />
        </div>
      </div>
    </section>
  )
}
