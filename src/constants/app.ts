export const SITE_URL = 'https://pasiopadelclub-production.up.railway.app'

export const EMAIL_RESEND_COOLDOWN_SECONDS = 60

type ClubInfo = {
  name: string
  address: {
    street: string
    city: string
    postalCode: string
    country: string
    full: string
    googleMapsUrl: string
  }
  phone: {
    display: string
    href: string
  }
  email: string
  hours: {
    open: string
    close: string
    days: string
  }
  courts: {
    total: number
  }
}

export const CLUB_INFO = {
  name: 'Pasio Padel Club',
  address: {
    street: '24 rue Arnaud Detroyat',
    city: 'Bayonne',
    postalCode: '64100',
    country: 'France',
    full: '24 rue Arnaud Detroyat, 64100 Bayonne',
    googleMapsUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2894.5398318655325!2d-1.4963219237594685!3d43.49107286290169!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd514182cba36089%3A0xe20604785805f73!2sPASIO%20PADEL%20CLUB!5e0!3m2!1sfr!2sfr!4v1767289561820!5m2!1sfr!2sfr'
  },
  phone: {
    display: '05 59 42 81 33',
    href: 'tel:+33559428133'
  },
  email: 'pasio.padel.club@gmail.com',
  hours: {
    open: '8h',
    close: '22h',
    days: 'Tous les jours'
  },
  courts: {
    total: 7
  }
} as const satisfies ClubInfo

type SocialLink = {
  platform: 'instagram' | 'facebook'
  url: string
  label: string
}

export const SOCIAL_LINKS = [
  {
    platform: 'instagram',
    url: 'https://www.instagram.com/pasio_padel_club/',
    label: 'Instagram'
  },
  {
    platform: 'facebook',
    url: 'https://www.facebook.com/profile.php?id=61582670787439',
    label: 'Facebook'
  }
] as const satisfies SocialLink[]

export const APP_STORE_URL =
  'https://apps.apple.com/fr/app/pasio-padel-club/id6752693886'

export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.livexperience.pasiopadelclub'

export const APP_DOWNLOAD_URL = `${SITE_URL}/application`

type AppFeature = {
  title: string
  description: string
}

export const APP_FEATURES = [
  {
    title: 'Réservation instantanée',
    description: 'Réservez votre terrain en quelques secondes'
  },
  {
    title: 'Notifications',
    description: 'Rappels automatiques avant vos matchs'
  },
  {
    title: 'Historique',
    description: 'Retrouvez toutes vos réservations passées'
  },
  {
    title: 'Paiement sécurisé',
    description: "Payez directement depuis l'application"
  }
] as const satisfies AppFeature[]
