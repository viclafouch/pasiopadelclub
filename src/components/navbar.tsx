import { useQuery } from 'convex/react'
import { LogIn, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthActions } from '@convex-dev/auth/react'
import type { LinkOptions } from '@tanstack/react-router'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { api } from '../../convex/_generated/api'

const NAV_LINKS = [
  { linkOptions: { to: '/' }, label: 'Accueil' },
  { linkOptions: { to: '/tarifs' }, label: 'Tarifs' },
  { linkOptions: { to: '/galerie' }, label: 'Galerie' },
  { linkOptions: { to: '/contact' }, label: 'Contact' }
] as const satisfies { linkOptions: LinkOptions; label: string }[]

type NavbarProps = {
  variant?: 'overlay' | 'solid'
}

const PROTECTED_ROUTES = ['/mon-compte', '/admin'] satisfies LinkOptions['to'][]

export const Navbar = ({ variant = 'overlay' }: NavbarProps) => {
  const currentUser = useQuery(api.users.getCurrent)
  const { signOut } = useAuthActions()
  const navigate = useNavigate()
  const location = useLocation()

  const isAuthenticated = currentUser !== null && currentUser !== undefined
  const isOverlay = variant === 'overlay'

  const handleSignOut = async () => {
    await signOut()
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => {
      return location.pathname.startsWith(route)
    })

    if (isProtectedRoute) {
      navigate({ to: '/' })
    }
  }

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
        <div className="flex items-center gap-8">
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
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-white">
                {currentUser.firstName}
              </span>
              <Link
                to="/mon-compte"
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                <User className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Mon compte</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Déconnexion</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                <Link to="/connexion">
                  <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
                  Connexion
                </Link>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                asChild
                className="bg-white text-primary hover:bg-white/90"
              >
                <Link to="/inscription">Inscription</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
