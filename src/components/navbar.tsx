import React from 'react'
import { motion } from 'motion/react'
import {
  HamburgerButton,
  NavbarMobileMenu
} from '@/components/navbar-mobile-menu'
import { Button } from '@/components/ui/button'
import { NAV_LINKS } from '@/constants/navigation'
import { useScrollFade } from '@/hooks/use-scroll-fade'
import { cn } from '@/lib/utils'
import { Link, useLocation } from '@tanstack/react-router'

export const Navbar = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const isOverlay = location.pathname === '/'
  const { needsFallback, opacity } = useScrollFade({ enabled: isOverlay })

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 h-[var(--navbar-height)]',
          isOverlay
            ? 'navbar-scroll-fade'
            : 'bg-primary text-primary-foreground'
        )}
        aria-label="Navigation principale"
      >
        {needsFallback && opacity ? (
          <motion.div
            className="absolute inset-0 bg-primary"
            style={{ opacity }}
          />
        ) : null}
        <div className="container relative flex h-full items-center justify-between">
          <div className="flex items-center gap-6 lg:gap-10">
            <Link to="/" aria-label="Accueil Pasio Padel Club">
              <img
                src="/images/logo-navbar.webp"
                alt="Pasio Padel Club"
                width={120}
                height={49}
                loading="eager"
                decoding="async"
                className="h-10 w-auto"
              />
            </Link>
            <ul className="hidden items-center gap-8 lg:flex">
              {NAV_LINKS.map((link) => {
                return (
                  <li key={link.label}>
                    <Link
                      {...link.linkOptions}
                      className="text-sm text-white transition-colors hover:text-white/80"
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <Button
              size="lg"
              className="hidden rounded-full bg-white text-slate-900 hover:bg-white/90 sm:inline-flex"
              asChild
            >
              <Link to="/application">Réserver un terrain</Link>
            </Button>
            <HamburgerButton
              isOpen={isMobileMenuOpen}
              onClick={() => {
                return setIsMobileMenuOpen((prev) => {
                  return !prev
                })
              }}
            />
          </div>
        </div>
      </nav>
      <NavbarMobileMenu
        isOpen={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
      />
    </>
  )
}
