import { Clock, MapPin } from 'lucide-react'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AUTH_BACKGROUND_IMAGE, FEATURES } from './constants'

const AuthLayout = () => {
  return (
    <div className="pt-[var(--navbar-height)]">
      <main className="flex min-h-[calc(100svh-var(--navbar-height))] flex-col lg:flex-row">
        <section
          className="relative hidden flex-col justify-center bg-slate-900 px-6 py-12 lg:flex lg:w-1/2 lg:px-12 xl:px-20"
          aria-label="Avantages du club"
        >
          <img
            src={AUTH_BACKGROUND_IMAGE}
            alt=""
            aria-hidden="true"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-primary/30" />
          <div className="relative z-10 mx-auto w-full max-w-lg">
            <ul className="grid grid-cols-2 gap-4">
              {FEATURES.map((feature) => {
                const Icon = feature.icon

                return (
                  <li
                    key={feature.title}
                    className="flex flex-col items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-5 text-center backdrop-blur-sm"
                  >
                    <div className="flex size-12 items-center justify-center rounded-full bg-white/20">
                      <Icon className="size-6 text-white" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {feature.title}
                    </span>
                  </li>
                )
              })}
            </ul>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <MapPin className="size-4" aria-hidden="true" />
                Bayonne
              </span>
              <span className="flex items-center gap-2">
                <Clock className="size-4" aria-hidden="true" />
                8h - 22h, 7j/7
              </span>
            </div>
          </div>
        </section>
        <section
          className="flex flex-1 flex-col justify-center bg-background px-6 py-12 lg:px-12 xl:px-20"
          aria-label="Formulaire"
        >
          <div className="mx-auto w-full max-w-md lg:min-h-[500px]">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  )
}

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/', replace: true })
    }
  },
  head: () => {
    return {
      links: [
        {
          rel: 'preload',
          href: AUTH_BACKGROUND_IMAGE,
          as: 'image',
          type: 'image/webp',
          fetchPriority: 'high'
        }
      ]
    }
  },
  component: AuthLayout
})
