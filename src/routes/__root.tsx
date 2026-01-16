/// <reference types="vite/client" />

import Footer from '@/components/footer'
import { getAuthUserQueryOpts } from '@/constants/queries'
import type { CurrentUser } from '@/server/auth'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import appCss from '../styles.css?url'

type RootRouteContext = {
  queryClient: QueryClient
  user: CurrentUser | null
}

const NotFoundComponent = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 font-display text-6xl font-bold text-primary">404</h1>
      <h2 className="mb-4 font-display text-2xl font-semibold">
        Page non trouvée
      </h2>
      <p className="mb-8 text-muted-foreground">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="rounded-md bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}

const RootDocument = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="fr">
      <head>
        <link
          rel="preload"
          href="/fonts/pasio-body.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/pasio.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Footer />
        <TanStackDevtools
          config={{
            position: 'bottom-right'
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />
            }
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  notFoundComponent: NotFoundComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery(getAuthUserQueryOpts())

    return { user }
  },
  head: () => {
    return {
      meta: [
        { charSet: 'utf-8' },
        {
          name: 'theme-color',
          content: '#009869'
        },
        {
          name: 'color-scheme',
          content: 'light'
        },
        {
          name: 'robots',
          content: 'index,follow,noai,noimageai'
        },
        {
          httpEquiv: 'Content-Language',
          content: 'fr'
        },
        {
          httpEquiv: 'X-Robots-Tag',
          content: 'noai,noimageai'
        },
        {
          name: 'mobile-web-app-capable',
          content: 'yes'
        },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        {
          rel: 'icon',
          href: '/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png'
        },
        {
          rel: 'icon',
          href: '/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png'
        },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        {
          rel: 'icon',
          href: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          rel: 'icon',
          href: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  },
  component: () => {
    return (
      <RootDocument>
        <Outlet />
      </RootDocument>
    )
  }
})
