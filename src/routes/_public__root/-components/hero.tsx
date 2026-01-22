import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export const Hero = () => {
  return (
    <section className="relative flex h-svh flex-col bg-slate-900">
      <picture>
        <source srcSet="/images/background-hero.webp" type="image/webp" />
        <img
          src="/images/background-hero.png"
          alt="Terrain de padel professionnel"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="relative z-10 flex flex-1 flex-col justify-center px-8 pt-24 pb-32 lg:container">
        <div className="max-w-2xl">
          <div className="mb-6 flex items-center gap-2 text-sm text-white">
            <Clock className="size-4" />
            <span>Ouvert 7j/7 de 8h à 22h</span>
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
              <Link to="/reservation" preload="render">
                Réserver un terrain
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="size-6"
                >
                  <path
                    className="fill-primary"
                    d="M8.863 2.867c0 .466-.4.866-.867.866a.882.882 0 0 1-.867-.866c0-.467.4-.867.867-.867.467 0 .867.333.867.867Z"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M11.929 8c.067-.067.067-.133.134-.133.466-.734.333-1.8-.267-2.534l-.067-.066-.066-.067c-.667-.733-1.6-1-2.467-.733-.067 0-.133.066-.2.066s-.133.067-.2.067c-.067.067-.133.067-.2.133-.133.134-1.533 1.267-2 2.6l-.067.067-.8 2.867 2.867-.4h.067c1.4-.267 2.8-1.4 2.933-1.534l.2-.2.133-.133Zm1.134-3.733c.533.666.8 1.4.866 2.2.067.8-.066 1.6-.466 2.266-.067.134-.134.2-.2.334a.52.52 0 0 1-.267.266l-.333.334c-.4.333-1.934 1.533-3.667 1.866h-.2l-3.4.467-1.533 1.267a1.165 1.165 0 0 1-1.134.2c-.2-.067-.333-.2-.466-.334-.4-.466-.334-1.2.133-1.6l1.533-1.266L4.996 7s0-.067.067-.133c.466-1.267 1.4-2.334 2.066-2.934.2.2.534.334.867.334.8 0 1.467-.667 1.467-1.467v-.133c.466-.067 1 0 1.466.133.8.2 1.467.667 2 1.267l.067.066c0 .067.067.134.067.134Z"
                  />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
