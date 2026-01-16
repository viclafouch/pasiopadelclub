import {
  CalendarDays,
  LogOut,
  User as UserIcon,
  UserCircle
} from 'lucide-react'
import { motion } from 'motion/react'
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
  getAuthUserQueryOpts,
  getSlotsByDateQueryOpts
} from '@/constants/queries'
import type { User } from '@/constants/types'
import { useScrollFade } from '@/hooks/use-scroll-fade'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import type { LinkOptions } from '@tanstack/react-router'
import { Link, useRouteContext, useRouter } from '@tanstack/react-router'

const NAV_LINKS = [
  { linkOptions: { to: '/' }, label: 'Accueil' },
  { linkOptions: { to: '/tarifs' }, label: 'Tarifs' }
] as const satisfies { linkOptions: LinkOptions; label: string }[]

type NavbarProps = {
  variant?: 'overlay' | 'solid'
}

export const Navbar = ({ variant = 'overlay' }: NavbarProps) => {
  const { user } = useRouteContext({ from: '__root__' })
  const router = useRouter()
  const queryClient = useQueryClient()

  const isOverlay = variant === 'overlay'
  const { needsFallback, opacity } = useScrollFade({ enabled: isOverlay })

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
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-[var(--navbar-height)]',
        isOverlay ? 'navbar-scroll-fade' : 'bg-primary text-primary-foreground'
      )}
    >
      {needsFallback && opacity ? (
        <motion.div
          className="absolute inset-0 bg-primary"
          style={{ opacity }}
        />
      ) : null}
      <div className="container relative flex h-full items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="text-base font-display font-semibold tracking-widest text-white uppercase"
          >
            Pasio Padel
          </Link>
          <ul className="hidden items-center gap-8 md:flex">
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
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            className="rounded-full bg-white text-slate-900 hover:bg-white/90"
            asChild
          >
            <Link to="/reservation">Réserver</Link>
          </Button>
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
                  <p className="text-xs text-muted-foreground">{user.email}</p>
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
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/mon-compte" search={{}} className="cursor-pointer">
                    <UserCircle className="size-4" />
                    Mon compte
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
      </div>
    </nav>
  )
}
