import { seo } from '@/utils/seo'
import { createFileRoute } from '@tanstack/react-router'

const ReservationPage = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Réservation</h1>
      <p className="mt-4 text-muted-foreground">
        Page en cours de construction.
      </p>
    </main>
  )
}

export const Route = createFileRoute('/_public__root/reservation/')({
  component: ReservationPage,
  head: () => {
    return {
      meta: seo({
        title: 'Réservation',
        description:
          'Réservez votre court de padel en ligne à Pasio Padel Club Anglet. Choisissez votre créneau parmi nos 6 terrains disponibles 7j/7.',
        pathname: '/reservation'
      })
    }
  }
})
