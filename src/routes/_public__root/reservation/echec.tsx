import { HomeIcon, RefreshCwIcon, XCircleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { seo } from '@/utils/seo'
import { createFileRoute, Link } from '@tanstack/react-router'

const ReservationEchecPage = () => {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
          <XCircleIcon
            className="size-10 text-destructive"
            aria-hidden="true"
          />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold">Paiement échoué</h1>
          <p className="max-w-md text-muted-foreground">
            Une erreur est survenue lors du paiement. Votre réservation n&apos;a
            pas été confirmée. Vous pouvez réessayer ou revenir plus tard.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link to="/reservation">
              <RefreshCwIcon className="size-4" aria-hidden="true" />
              Réessayer
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">
              <HomeIcon className="size-4" aria-hidden="true" />
              Retour à l&apos;accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_public__root/reservation/echec')({
  head: () => {
    return {
      meta: seo({
        title: 'Paiement échoué',
        description: 'Le paiement de votre réservation a échoué.'
      })
    }
  },
  component: ReservationEchecPage
})
