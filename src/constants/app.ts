export const APP_STORE_URL = 'https://apps.apple.com/app/pasio-padel-club'

export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.pasiopadelclub'

export const APP_DOWNLOAD_URL = 'https://pasiopadelclub.fr/application'

type AppFeature = {
  title: string
  description: string
}

export const APP_FEATURES = [
  {
    title: 'Réservation instantanée',
    description: 'Réservez votre terrain en quelques secondes, 24h/24'
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
