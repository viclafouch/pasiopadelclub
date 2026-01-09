import { cn } from '@/lib/utils'
import type { LinkOptions } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

const NAV_LINKS = [
  { linkOptions: { to: '/' }, label: 'Accueil' },
  { linkOptions: { to: '/tarifs' }, label: 'Tarifs' },
  { linkOptions: { to: '/galerie' }, label: 'Galerie' },
  { linkOptions: { to: '/contact' }, label: 'Contact' }
] as const satisfies { linkOptions: LinkOptions; label: string }[]

type NavbarProps = {
  variant?: 'overlay' | 'solid'
}

export const Navbar = ({ variant = 'overlay' }: NavbarProps) => {
  const isOverlay = variant === 'overlay'

  return (
    <nav
      className={cn(
        'left-0 right-0 z-50 py-4',
        isOverlay ? 'sticky top-0' : 'static bg-primary text-primary-foreground'
      )}
    >
      <div className="flex container items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-white">
          PASIO PADEL
        </Link>
        <ul className="flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            return (
              <li key={link.label}>
                <Link
                  {...link.linkOptions}
                  className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
