import React from 'react'
import {
  CalendarDays,
  History,
  LogOut,
  User as UserIcon,
  UserCircle,
  Wallet
} from 'lucide-react'
import { motion } from 'motion/react'
import {
  HamburgerButton,
  NavbarMobileMenu
} from '@/components/navbar-mobile-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  getActiveBookingCountQueryOpts,
  getAuthUserQueryOpts,
  getSlotsByDateQueryOpts,
  getUserBalanceQueryOpts
} from '@/constants/queries'
import type { User } from '@/constants/types'
import { formatCentsToEuros } from '@/helpers/number'
import { useScrollFade } from '@/hooks/use-scroll-fade'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { LinkOptions } from '@tanstack/react-router'
import {
  Link,
  useLocation,
  useRouteContext,
  useRouter
} from '@tanstack/react-router'

const NAV_LINKS = [
  { linkOptions: { to: '/tarifs' }, label: 'Tarifs' },
  { linkOptions: { to: '/credits' }, label: 'Packs' },
  { linkOptions: { to: '/application' }, label: 'Application' }
] as const satisfies { linkOptions: LinkOptions; label: string }[]

export const Navbar = () => {
  const { user } = useRouteContext({ from: '__root__' })
  const router = useRouter()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const isOverlay = location.pathname === '/'
  const { needsFallback, opacity } = useScrollFade({ enabled: isOverlay })

  const userBalanceQuery = useQuery({
    ...getUserBalanceQueryOpts(),
    enabled: Boolean(user)
  })

  const activeBookingCountQuery = useQuery({
    ...getActiveBookingCountQueryOpts(),
    enabled: Boolean(user)
  })

  const handleSignOut = async () => {
    await authClient.signOut()
    queryClient.removeQueries(getAuthUserQueryOpts())
    queryClient.removeQueries({ queryKey: getSlotsByDateQueryOpts.all })
    await router.invalidate()
  }

  const getInitials = (
    firstName: User['firstName'],
    lastName: User['lastName']
  ) => {
    const first = firstName.charAt(0).toUpperCase()
    const last = lastName.charAt(0).toUpperCase()

    return first + last || 'U'
  }

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
            <Link
              to="/"
              className="font-display text-base font-semibold tracking-widest text-white uppercase"
            >
              Pasio Padel
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
              <Link to="/reservation">Réserver un terrain</Link>
            </Button>
            <div className="hidden lg:flex lg:items-center">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    >
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-transparent text-sm font-medium text-white">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/mon-compte"
                        search={{ tab: 'reservations' }}
                        className="cursor-pointer"
                      >
                        <CalendarDays className="size-4" />
                        Mes réservations
                        {activeBookingCountQuery.data ? (
                          <span className="ml-auto text-muted-foreground">
                            ({activeBookingCountQuery.data})
                          </span>
                        ) : null}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/mon-compte"
                        search={{ tab: 'credits' }}
                        className="cursor-pointer"
                      >
                        <Wallet className="size-4" />
                        Mes crédits
                        {userBalanceQuery.data ? (
                          <span className="ml-auto text-muted-foreground">
                            (
                            {formatCentsToEuros(userBalanceQuery.data, {
                              minimumFractionDigits: 2
                            })}
                            )
                          </span>
                        ) : null}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/mon-compte"
                        search={{ tab: 'historique' }}
                        className="cursor-pointer"
                      >
                        <History className="size-4" />
                        Historique
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/mon-compte"
                        search={{ tab: 'profil' }}
                        className="cursor-pointer"
                      >
                        <UserCircle className="size-4" />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="size-4" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/connexion">
                    <UserIcon className="size-4" />
                    Connexion
                  </Link>
                </Button>
              )}
            </div>
            <HamburgerButton
              isOpen={isMobileMenuOpen}
              onClick={() => {
                setIsMobileMenuOpen((prev) => {
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
        user={user}
      />
    </>
  )
}
