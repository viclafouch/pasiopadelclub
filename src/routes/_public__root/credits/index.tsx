import React from 'react'
import { z } from 'zod'
import { AnimatedNotification } from '@/components/animated-notification'
import { BookingCta } from '@/components/booking-cta'
import { CreditPackCard } from '@/components/credit-pack-card'
import { PageHeader } from '@/components/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { getCreditPacksQueryOpts } from '@/constants/queries'
import { getErrorMessage } from '@/helpers/error'
import { createCreditPackCheckoutFn } from '@/server/credits-checkout'
import { seo } from '@/utils/seo'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  createFileRoute,
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
      <section className="section-py">
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
      <section className="section-py">
        <div className="container space-y-16">
          <PageHeader
            title="Packs de crédits"
            description="Économisez sur vos réservations avec nos packs de crédits. Plus vous achetez, plus vous gagnez."
          />
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
      <BookingCta
        eyebrow="Pas de crédits ? Pas de problème"
        title="Pas encore convaincu ?"
        description="Réservez directement un terrain et payez à la séance. Simple, flexible, sans engagement."
      />
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
      ...seo({
        title: 'Packs de crédits',
        description:
          'Achetez des packs de crédits et économisez sur vos réservations de padel. Bonus exclusifs sur nos packs Starter, Pro et Premium.',
        keywords:
          'pack crédits padel, abonnement padel bayonne, forfait padel pays basque, réduction padel',
        pathname: '/credits'
      })
    }
  }
})
