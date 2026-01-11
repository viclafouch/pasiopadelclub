import React from 'react'
import { useConvexAuth } from 'convex/react'
import { SignupForm } from '@/components/auth/signup-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

const InscriptionPage = () => {
  const { isLoading, isAuthenticated } = useConvexAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading || isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="container relative">
          <div className="mx-auto max-w-md">
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Créer un compte
              </h1>
              <p className="mt-3 text-muted-foreground">
                Rejoignez Pasio Padel Club et réservez vos créneaux en ligne.
              </p>
            </div>
            <div className="mt-8 rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
              <SignupForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export const Route = createFileRoute('/_public__root/inscription/')({
  component: InscriptionPage,
  head: () => {
    return {
      meta: [
        { title: 'Inscription | Pasio Padel Club - Anglet' },
        {
          name: 'description',
          content:
            'Créez votre compte Pasio Padel Club pour réserver vos créneaux de padel en ligne à Anglet.'
        }
      ]
    }
  }
})
