import { z } from 'zod'
import { fr } from 'zod/locales'
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from './routeTree.gen'

z.config(fr())

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 300_000,
        refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        networkMode: 'online',
        retry: false
      },
      mutations: {
        retry: false,
        networkMode: 'online',
        gcTime: 300_000
      }
    }
  })

  const router = createRouter({
    routeTree,
    context: {
      queryClient
    },
    defaultPreload: 'intent',
    defaultPreloadDelay: 50,
    defaultPreloadStaleTime: 30_000,
    defaultPendingMs: 1000,
    defaultPendingMinMs: 200,
    notFoundMode: 'fuzzy'
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient
  })

  return router
}

declare module '@tanstack/react-router' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
