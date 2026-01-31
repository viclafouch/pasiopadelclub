import type { LinkOptions } from '@tanstack/react-router'

export const NAV_LINKS = [
  { linkOptions: { to: '/tarifs', preload: 'viewport' }, label: 'Tarifs' },
  {
    linkOptions: { to: '/application', preload: 'viewport' },
    label: 'Application'
  },
  { linkOptions: { to: '/galerie' }, label: 'Galerie' },
  { linkOptions: { to: '/contact' }, label: 'Contact' }
] as const satisfies { linkOptions: LinkOptions; label: string }[]
