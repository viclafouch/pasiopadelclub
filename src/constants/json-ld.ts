import type { SportsActivityLocation, WithContext } from 'schema-dts'

export const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'SportsActivityLocation',
  '@id': 'https://pasiopadelclub-production.up.railway.app/#organization',
  name: 'Pasio Padel Club',
  description:
    'Club de padel à Bayonne avec 7 terrains indoor et semi-couverts. Réservation en ligne, location de matériel.',
  url: 'https://pasiopadelclub-production.up.railway.app',
  telephone: '+33559428133',
  email: 'pasio.padel.club@gmail.com',
  priceRange: '15€-60€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Carte bancaire',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '24 rue Arnaud Detroyat',
    addressLocality: 'Bayonne',
    postalCode: '64100',
    addressCountry: 'FR',
    addressRegion: 'Nouvelle-Aquitaine'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 43.491073,
    longitude: -1.496322
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    opens: '08:00',
    closes: '22:00'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Location de terrains de padel',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Terrain Double',
          description:
            'Location terrain de padel double (4 joueurs) - 90 minutes'
        },
        price: '60',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: 'https://pasiopadelclub-production.up.railway.app/reservation'
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Terrain Simple',
          description:
            'Location terrain de padel simple (2 joueurs) - 60 minutes'
        },
        price: '30',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: 'https://pasiopadelclub-production.up.railway.app/reservation'
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Terrain Kids',
          description:
            'Location terrain de padel kids (2 joueurs) - 60 minutes - Ouvert à tous'
        },
        price: '15',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: 'https://pasiopadelclub-production.up.railway.app/reservation'
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Location de raquette',
          description: 'Location de raquette de padel'
        },
        price: '3',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock'
      }
    ]
  },
  sameAs: [
    'https://www.instagram.com/pasio_padel_club/',
    'https://www.facebook.com/profile.php?id=61582670787439'
  ],
  amenityFeature: [
    {
      '@type': 'LocationFeatureSpecification',
      name: 'Vestiaires',
      value: true
    },
    { '@type': 'LocationFeatureSpecification', name: 'Douches', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Bar', value: true },
    {
      '@type': 'LocationFeatureSpecification',
      name: 'Location de matériel',
      value: true
    },
    {
      '@type': 'LocationFeatureSpecification',
      name: 'Vidéo des matchs',
      value: true
    }
  ]
} as const satisfies WithContext<SportsActivityLocation>

export const LOCAL_BUSINESS_JSON_LD = JSON.stringify(LOCAL_BUSINESS_SCHEMA)
