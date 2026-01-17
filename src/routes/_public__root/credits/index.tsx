import React from 'react'
import { z } from 'zod'
import { AnimatedNotification } from '@/components/animated-notification'
import { CreditPackCard } from '@/components/credit-pack-card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getCreditPacksQueryOpts } from '@/constants/queries'
import { getErrorMessage } from '@/helpers/error'
import { createCreditPackCheckoutFn } from '@/server/credits-checkout'
import { seo } from '@/utils/seo'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouteContext
} from '@tanstack/react-router'

const searchSchema = z.object({
  success: z.boolean().optional(),
  cancelled: z.boolean().optional()
})

const POPULAR_PACK_NAME = 'Pro'

const CreditsPageSkeleton = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20 lg:py-28">
        <div className="container space-y-16">
          <div className="mx-auto max-w-3xl text-center">
            <Skeleton className="mx-auto h-12 w-64 md:h-14 lg:h-16" />
            <Skeleton className="mx-auto mt-6 h-6 w-96" />
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3 lg:items-center">
            <Skeleton className="h-96 rounded-3xl" />
            <Skeleton className="h-[26rem] rounded-3xl lg:scale-105" />
            <Skeleton className="h-96 rounded-3xl" />
          </div>
        </div>
      </section>
    </main>
  )
}

const CreditsPageContent = () => {
  const { success, cancelled } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const { user } = useRouteContext({ from: '/_public__root' })
  const isLoggedIn = user !== null

  const packsQuery = useSuspenseQuery(getCreditPacksQueryOpts())

  const checkoutMutation = useMutation({
    mutationFn: async (packId: string) => {
      const result = await createCreditPackCheckoutFn({ data: { packId } })
      window.location.href = result.url
    }
  })

  const handlePurchase = (packId: string) => {
    if (!isLoggedIn) {
      navigate({ to: '/connexion', search: { redirect: '/credits' } })

      return
    }

    checkoutMutation.mutate(packId)
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="py-20 lg:py-28">
        <div className="container space-y-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Packs de crédits
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Économisez sur vos réservations avec nos packs de crédits. Plus
              vous achetez, plus vous gagnez.
            </p>
          </div>
          <div className="mx-auto max-w-5xl space-y-8">
            <AnimatedNotification
              show={success === true}
              variant="success"
              withSpacing
            >
              Votre achat a été effectué avec succès ! Vos crédits sont
              disponibles.
            </AnimatedNotification>
            <AnimatedNotification
              show={cancelled === true}
              variant="info"
              withSpacing
            >
              L&apos;achat a été annulé. Vous pouvez réessayer quand vous le
              souhaitez.
            </AnimatedNotification>
            {checkoutMutation.isError ? (
              <p role="alert" className="text-center text-sm text-destructive">
                {getErrorMessage(checkoutMutation.error)}
              </p>
            ) : null}
            <div className="grid gap-6 lg:grid-cols-3 lg:items-center">
              {packsQuery.data.map((pack) => {
                return (
                  <CreditPackCard
                    key={pack.id}
                    pack={pack}
                    isPopular={pack.name === POPULAR_PACK_NAME}
                    isPending={
                      checkoutMutation.isPending
                        ? checkoutMutation.variables === pack.id
                        : false
                    }
                    onPurchase={() => {
                      handlePurchase(pack.id)
                    }}
                  />
                )
              })}
            </div>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">
              Crédits valables sur{' '}
              <span className="font-semibold text-foreground">
                tous les terrains
              </span>
              , remboursés en cas d&apos;annulation
            </p>
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden border-t border-border/50 bg-background py-16">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
              Pas encore convaincu ?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Réservez directement un terrain et payez à la séance.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to="/reservation">Réserver un terrain</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

const CreditsPage = () => {
  return (
    <React.Suspense fallback={<CreditsPageSkeleton />}>
      <CreditsPageContent />
    </React.Suspense>
  )
}

export const Route = createFileRoute('/_public__root/credits/')({
  validateSearch: searchSchema,
  component: CreditsPage,
  head: () => {
    return {
      meta: seo({
        title: 'Packs de crédits',
        description:
          'Achetez des packs de crédits et économisez sur vos réservations de padel. Bonus exclusifs sur nos packs Starter, Pro et Premium.',
        pathname: '/credits'
      })
    }
  }
})
