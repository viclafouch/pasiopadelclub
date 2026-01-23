import React from 'react'
import { LogOut, UserCircle, X } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { ACCOUNT_LINKS, NAV_LINKS } from '@/constants/navigation'
import {
  getActiveBookingCountQueryOpts,
  getUserBalanceQueryOpts
} from '@/constants/queries'
import type { User } from '@/constants/types'
import { formatCentsToEuros } from '@/helpers/number'
import { useSignOut } from '@/hooks/use-sign-out'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
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
        />
        <motion.span
          initial={false}
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute h-0.5 w-5 rounded-full bg-current"
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
        />
      </div>
    </Button>
  )
}

type NavbarMobileMenuProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export const NavbarMobileMenu = ({
  isOpen,
  onOpenChange,
  user
}: NavbarMobileMenuProps) => {
  const signOut = useSignOut()
  const closeButtonRef = React.useRef<HTMLButtonElement>(null)

  const userBalanceQuery = useQuery({
    ...getUserBalanceQueryOpts(),
    enabled: Boolean(user)
  })

  const activeBookingCountQuery = useQuery({
    ...getActiveBookingCountQueryOpts(),
    enabled: Boolean(user)
  })

  const handleOpenAutoFocus = (event: Event) => {
    event.preventDefault()
    closeButtonRef.current?.focus()
  }

  const handleSignOut = async () => {
    onOpenChange(false)
    await signOut()
  }

  const handleLinkClick = () => {
    onOpenChange(false)
  }

  const getBadgeValue = (badgeType: 'bookings' | 'balance' | null) => {
    if (badgeType === 'bookings' && activeBookingCountQuery.data) {
      return `(${activeBookingCountQuery.data})`
    }

    if (badgeType === 'balance' && userBalanceQuery.data) {
      return `(${formatCentsToEuros(userBalanceQuery.data, { minimumFractionDigits: 2 })})`
    }

    return null
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full" onOpenAutoFocus={handleOpenAutoFocus}>
        <DrawerTitle className="sr-only">Menu de navigation</DrawerTitle>
        <DrawerDescription className="sr-only">
          Accédez aux pages et à votre compte
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
            {user ? (
              <>
                <Separator className="my-4" />
                <div className="mb-3 px-4">
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="space-y-1">
                  {ACCOUNT_LINKS.map((link) => {
                    const Icon = link.icon
                    const badge = getBadgeValue(link.badgeType)

                    return (
                      <Link
                        key={link.label}
                        {...link.linkOptions}
                        onClick={handleLinkClick}
                        className="flex h-12 items-center gap-3 rounded-lg px-4 text-base transition-colors hover:bg-accent"
                      >
                        <Icon className="size-5 text-muted-foreground" />
                        <span className="flex-1">{link.label}</span>
                        {badge ? (
                          <span className="text-sm text-muted-foreground">
                            {badge}
                          </span>
                        ) : null}
                      </Link>
                    )
                  })}
                </div>
                <Separator className="my-4" />
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className={cn(
                    'h-12 w-full justify-start gap-3 px-4 text-base',
                    'text-destructive hover:bg-destructive/10 hover:text-destructive'
                  )}
                >
                  <LogOut className="size-5" />
                  Se déconnecter
                </Button>
              </>
            ) : (
              <>
                <Separator className="my-4" />
                <Link
                  to="/connexion"
                  onClick={handleLinkClick}
                  className="flex h-12 items-center gap-3 rounded-lg px-4 text-base font-medium transition-colors hover:bg-accent"
                >
                  <UserCircle className="size-5 text-muted-foreground" />
                  Connexion
                </Link>
              </>
            )}
          </nav>
          <div className="border-t p-4">
            <Button
              size="lg"
              className="w-full rounded-full"
              asChild
              onClick={handleLinkClick}
            >
              <Link to="/reservation">Réserver un terrain</Link>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
