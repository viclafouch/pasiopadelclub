import { CalendarIcon, CheckCircleIcon, HomeIcon } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { seo } from '@/utils/seo'
import { createFileRoute, Link } from '@tanstack/react-router'

const searchSchema = z.object({
  // eslint-disable-next-line camelcase -- Polar uses snake_case
  checkout_id: z.string().optional()
})

const ReservationSuccessPage = () => {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircleIcon
            className="size-10 text-green-600"
            aria-hidden="true"
          />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold">
            Réservation confirmée !
          </h1>
          <p className="max-w-md text-muted-foreground">
            Votre paiement a été accepté et votre créneau est réservé. Vous
            recevrez un email de confirmation avec tous les détails.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link to="/mon-compte" search={{ tab: 'reservations' }}>
              <CalendarIcon className="size-4" aria-hidden="true" />
              Mes réservations
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

export const Route = createFileRoute('/_public__root/reservation/success')({
  validateSearch: searchSchema,
  head: () => {
    return {
      meta: seo({
        title: 'Réservation confirmée',
        description: 'Votre réservation a été confirmée avec succès.'
      })
    }
  },
  component: ReservationSuccessPage
})
