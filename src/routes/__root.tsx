/// <reference types="vite/client" />

import type { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import Footer from '@/components/footer'
import { authStateFn } from '@/server/auth'
import { frFR } from '@clerk/localizations'
import { ClerkProvider, useAuth } from '@clerk/tanstack-react-start'
import type { ConvexQueryClient } from '@convex-dev/react-query'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouteContext
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import appCss from '../styles.css?url'

type RootRouteContext = {
  queryClient: QueryClient
  convexClient: ConvexReactClient
  convexQueryClient: ConvexQueryClient
}

const NotFoundComponent = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">Page non trouvée</h2>
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
  const { convexClient } = useRouteContext({ from: '__root__' })

  return (
    <ClerkProvider localization={frFR}>
      <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
        <html lang="fr">
          <head>
            <link
              href="https://fonts.cdnfonts.com/css/satoshi"
              rel="stylesheet"
            />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin=""
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
              rel="stylesheet"
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
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  notFoundComponent: NotFoundComponent,
  beforeLoad: async ({ context }) => {
    if (context.convexQueryClient.serverHttpClient) {
      const { token } = await authStateFn()

      // During SSR only (the only time serverHttpClient exists),
      // set the Clerk auth token to make HTTP queries with.
      if (token) {
        context.convexQueryClient.serverHttpClient.setAuth(token)
      }
    }
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
