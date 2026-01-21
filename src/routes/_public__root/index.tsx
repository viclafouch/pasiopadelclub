import { Faq } from '@/components/faq'
import { Map } from '@/components/map'
import { CLUB_INFO } from '@/constants/app'
import { seo } from '@/utils/seo'
import { createFileRoute } from '@tanstack/react-router'
import { AppDownloadSection } from './-components/app-download-section'
import { BookingSection } from './-components/booking-section'
import { FeaturesSection } from './-components/features-section'
import { Hero } from './-components/hero'
import { StoriesSection } from './-components/stories-section'

const RouteComponent = () => {
  return (
    <main>
      <Hero />
      <FeaturesSection />
      <BookingSection />
      <AppDownloadSection />
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
      ...seo({
        title: `Réservation de courts de padel à ${CLUB_INFO.address.city}`,
        description: `${CLUB_INFO.name} à ${CLUB_INFO.address.city} : réservez vos courts de padel en ligne. 7 terrains disponibles 7j/7 de ${CLUB_INFO.hours.open} à ${CLUB_INFO.hours.close}. Location de raquettes et cours particuliers.`,
        keywords:
          'padel bayonne, réserver padel pays basque, club padel 64, terrain padel bayonne, padel anglet, padel biarritz',
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
