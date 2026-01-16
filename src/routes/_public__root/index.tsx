import { Faq } from '@/components/faq'
import { Map } from '@/components/map'
import { seo } from '@/utils/seo'
import { createFileRoute } from '@tanstack/react-router'
import { BookingSection } from './-components/booking-section'
import { Hero } from './-components/hero'
import { StoriesSection } from './-components/stories-section'

const RouteComponent = () => {
  return (
    <main>
      <Hero />
      <BookingSection />
      <Faq />
      <StoriesSection />
      <Map />
    </main>
  )
}

export const Route = createFileRoute('/_public__root/')({
  component: RouteComponent,
  head: () => {
    return {
      meta: seo({
        title: 'Réservation de courts de padel à Anglet',
        description:
          'Pasio Padel Club à Anglet : réservez vos courts de padel en ligne. 6 terrains disponibles 7j/7 de 8h à 22h. Location de raquettes et cours particuliers.',
        pathname: '/'
      }),
      links: [
        {
          rel: 'preload',
          href: '/images/background-hero.webp',
          as: 'image',
          type: 'image/webp'
        }
      ]
    }
  }
})
