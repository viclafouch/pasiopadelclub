import { getYear } from 'date-fns'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CLUB_INFO, SOCIAL_LINKS } from '@/constants/app'
import type { LinkOptions } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

type IconProps = React.ComponentProps<'svg'>

const InstagramIcon = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
        clipRule="evenodd"
      />
    </svg>
  )
}

const FacebookIcon = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  )
}

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon
} as const

const NAV_LINKS = [
  { to: '/tarifs', label: 'Nos tarifs' },
  { to: '/galerie', label: 'Galerie photos' },
  { to: '/credits', label: 'Packs de crédits' },
  { to: '/application', label: 'Application mobile' }
] as const satisfies readonly { to: LinkOptions['to']; label: string }[]

const LEGAL_LINKS = [
  { to: '/mentions-legales', label: 'Mentions légales' },
  { to: '/cgv', label: 'CGV' },
  { to: '/politique-confidentialite', label: 'Politique de confidentialité' }
] as const satisfies readonly { to: LinkOptions['to']; label: string }[]

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 xs:grid-cols-2 xs:gap-10 lg:grid-cols-4">
          <div className="space-y-4">
            <Link
              to="/"
              aria-label="Accueil Pasio Padel Club"
              className="block"
            >
              <img
                width={48}
                height={48}
                src="/logo.webp"
                alt=""
                aria-hidden="true"
                className="size-12"
              />
            </Link>
            <p className="text-sm text-muted-foreground text-balance">
              Votre club de padel à Bayonne, ouvert tous les jours de 8h à 22h.
            </p>
            <ul className="flex gap-4" aria-label="Réseaux sociaux">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform]

                return (
                  <li key={social.platform}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
          <nav aria-label="Liens utiles" className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Découvrir</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => {
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <address className="space-y-3 not-italic">
              <a
                href={CLUB_INFO.phone.href}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                {CLUB_INFO.phone.display}
              </a>
              <a
                href={`mailto:${CLUB_INFO.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                {CLUB_INFO.email}
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLUB_INFO.address.full)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  {CLUB_INFO.address.street}
                  <br />
                  {CLUB_INFO.address.postalCode} {CLUB_INFO.address.city}
                </span>
              </a>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4 shrink-0" aria-hidden="true" />
                <span>
                  Tous les jours,{' '}
                  <time className="font-medium text-primary">8h00 — 22h00</time>
                </span>
              </p>
            </address>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Réservez maintenant
            </h3>
            <p className="text-sm text-muted-foreground text-balance">
              6 terrains disponibles, réservation en ligne 24h/24.
            </p>
            <div className="space-y-3">
              <Button asChild>
                <Link to="/reservation">Réserver un terrain</Link>
              </Button>
              <Link
                to="/contact"
                className="block text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Une question ? Contactez-nous
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <nav
            aria-label="Mentions légales"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground md:justify-start"
          >
            {LEGAL_LINKS.map((link, index) => {
              return (
                <span key={link.to} className="contents">
                  {index > 0 ? <span aria-hidden="true">·</span> : null}
                  <Link
                    to={link.to}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </span>
              )
            })}
          </nav>
          <p className="text-center text-sm text-muted-foreground md:text-right">
            © {getYear(new Date())} {CLUB_INFO.name} — Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
