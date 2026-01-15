import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export const Hero = () => {
  return (
    <section className="relative flex h-svh flex-col">
      <img
        src="/images/background-hero.png"
        alt="Terrain de padel professionnel"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
        decoding="async"
      />
      <div className="relative z-10 flex flex-1 flex-col justify-center px-8 pt-24 lg:container">
        <div className="max-w-2xl">
          <div className="mb-6 flex items-center gap-2 text-sm text-white">
            <Star className="size-4 fill-white" />
            <span>Plébiscité par les joueurs compétitifs</span>
          </div>
          <h1 className="font-display mb-6 text-5xl leading-[1.05] font-thin tracking-tight text-white md:text-6xl lg:text-7xl">
            Vivez le padel.
            <br />
            Autrement.
          </h1>
          <p className="mb-10 max-w-lg text-lg text-white/80">
            Des terrains de padel haut de gamme conçus pour les joueurs qui
            recherchent contrôle, précision et performance.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="h-12 rounded-full bg-white px-8 text-base text-slate-900 hover:bg-white/90"
              asChild
            >
              <Link to="/reservation">Réserver un terrain</Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="liquid-glass h-12 rounded-full px-8 text-base text-white"
              asChild
            >
              <Link to="/tarifs">Voir nos tarifs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
