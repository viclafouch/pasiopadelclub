import React from 'react'
import { cn } from '@/lib/utils'
import type { LinkOptions } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

const navLinks = [
  { linkOptions: { to: '/' }, label: 'Accueil' },
  { linkOptions: { to: '/' }, label: 'Nos terrains' },
  { linkOptions: { to: '/' }, label: 'Tarifs' },
  { linkOptions: { to: '/' }, label: 'Contact' }
] as const satisfies { linkOptions: LinkOptions; label: string }[]

export const Navbar = ({ className }: { className?: string }) => {
  return (
    <nav className={cn(className, 'sticky top-0 left-0 right-0 z-50 py-4')}>
      <div className="flex container items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-white">
          PASIO PADEL
        </Link>
        <ul className="flex items-center gap-8">
          {navLinks.map((link) => {
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
