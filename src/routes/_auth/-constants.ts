import type { LucideIcon } from 'lucide-react'
import { Calendar, Shield, Users, Wallet } from 'lucide-react'

export const AUTH_BACKGROUND_IMAGE = '/images/auth/auth-background.webp'

type Feature = {
  icon: LucideIcon
  title: string
}

export const FEATURES = [
  { icon: Calendar, title: 'Réservation instantanée' },
  { icon: Users, title: '7 terrains disponibles' },
  { icon: Wallet, title: 'Packs crédits avantageux' },
  { icon: Shield, title: 'Annulation flexible' }
] as const satisfies readonly Feature[]
