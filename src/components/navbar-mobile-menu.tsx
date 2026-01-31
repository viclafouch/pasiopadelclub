import React from 'react'
import { X } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle
} from '@/components/ui/drawer'
import { NAV_LINKS } from '@/constants/navigation'
import { Link } from '@tanstack/react-router'

type HamburgerButtonProps = {
  isOpen: boolean
  onClick: () => void
}

export const HamburgerButton = ({ isOpen, onClick }: HamburgerButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
      className="relative size-10 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white lg:hidden"
    >
      <div className="flex size-5 flex-col items-center justify-center">
        <motion.span
          initial={false}
          animate={
            isOpen
              ? { rotate: 45, translateY: 0 }
              : { rotate: 0, translateY: -4 }
          }
          transition={{ duration: 0.2 }}
          className="absolute h-0.5 w-5 rounded-full bg-current"
          style={{ willChange: 'transform' }}
        />
        <motion.span
          initial={false}
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute h-0.5 w-5 rounded-full bg-current"
          style={{ willChange: 'opacity' }}
        />
        <motion.span
          initial={false}
          animate={
            isOpen
              ? { rotate: -45, translateY: 0 }
              : { rotate: 0, translateY: 4 }
          }
          transition={{ duration: 0.2 }}
          className="absolute h-0.5 w-5 rounded-full bg-current"
          style={{ willChange: 'transform' }}
        />
      </div>
    </Button>
  )
}

type NavbarMobileMenuProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const NavbarMobileMenu = ({
  isOpen,
  onOpenChange
}: NavbarMobileMenuProps) => {
  const closeButtonRef = React.useRef<HTMLButtonElement>(null)

  const handleOpenAutoFocus = (event: Event) => {
    event.preventDefault()
    closeButtonRef.current?.focus()
  }

  const handleLinkClick = () => {
    onOpenChange(false)
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full" onOpenAutoFocus={handleOpenAutoFocus}>
        <DrawerTitle className="sr-only">Menu de navigation</DrawerTitle>
        <DrawerDescription className="sr-only">
          Accédez aux pages du site
        </DrawerDescription>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <span className="font-display text-lg font-semibold tracking-wider uppercase">
              Menu
            </span>
            <DrawerClose asChild>
              <Button
                ref={closeButtonRef}
                variant="ghost"
                size="icon"
                className="size-9"
                aria-label="Fermer le menu"
              >
                <X className="size-5" />
              </Button>
            </DrawerClose>
          </div>
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Menu mobile">
            <div className="space-y-1">
              {NAV_LINKS.map((link) => {
                return (
                  <Link
                    key={link.label}
                    {...link.linkOptions}
                    onClick={handleLinkClick}
                    className="flex h-12 items-center rounded-lg px-4 text-base font-medium transition-colors hover:bg-accent"
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </nav>
          <div className="border-t p-4">
            <Button
              size="lg"
              className="w-full rounded-full"
              asChild
              onClick={handleLinkClick}
            >
              <Link to="/application">Réserver un terrain</Link>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
