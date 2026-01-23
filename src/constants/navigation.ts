import type { LucideIcon } from 'lucide-react'
import { CalendarDays, History, UserCircle, Wallet } from 'lucide-react'
import type { LinkOptions } from '@tanstack/react-router'

export const NAV_LINKS = [
  { linkOptions: { to: '/tarifs' }, label: 'Tarifs' },
  { linkOptions: { to: '/credits' }, label: 'Packs' },
  { linkOptions: { to: '/galerie' }, label: 'Galerie' },
  { linkOptions: { to: '/contact' }, label: 'Contact' }
] as const satisfies { linkOptions: LinkOptions; label: string }[]

type BadgeType = 'bookings' | 'balance' | null

export const ACCOUNT_LINKS = [
  {
    linkOptions: { to: '/mon-compte', search: { tab: 'reservations' } },
    label: 'Mes réservations',
    icon: CalendarDays,
    badgeType: 'bookings'
  },
  {
    linkOptions: { to: '/mon-compte', search: { tab: 'credits' } },
    label: 'Mes crédits',
    icon: Wallet,
    badgeType: 'balance'
  },
  {
    linkOptions: { to: '/mon-compte', search: { tab: 'historique' } },
    label: 'Historique',
    icon: History,
    badgeType: null
  },
  {
    linkOptions: { to: '/mon-compte', search: { tab: 'profil' } },
    label: 'Profil',
    icon: UserCircle,
    badgeType: null
  }
] as const satisfies {
  linkOptions: LinkOptions
  label: string
  icon: LucideIcon
  badgeType: BadgeType
}[]
