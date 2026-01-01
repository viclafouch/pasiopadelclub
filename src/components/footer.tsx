/* eslint-disable @typescript-eslint/no-deprecated */
import { Instagram } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Link } from '@tanstack/react-router'

const Footer = () => {
  return (
    <footer>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8">
        <Link to="/">
          <div className="flex items-center gap-3">
            <img width={40} src="/logo.webp" alt="Pasio Padel Club" />
          </div>
        </Link>
        <div className="flex items-center gap-5 whitespace-nowrap">
          <Link
            to="/"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            Réservations
          </Link>
          <Link
            to="/"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            A propos
          </Link>
          <Link
            to="/"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            Contact
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/pasio_padel_club/"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram className="size-5" />
          </a>
        </div>
      </div>
      <Separator />
      <div className="mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6">
        <p className="text-center font-medium text-balance">
          {`©${new Date().getFullYear()}`} PasioPadelClub
        </p>
      </div>
    </footer>
  )
}

export default Footer
