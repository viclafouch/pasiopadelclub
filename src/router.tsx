import { z } from 'zod'
import { fr } from 'zod/locales'
import { MINUTE, SECOND } from '@/constants/time'
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from './routeTree.gen'

z.config(fr())

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * SECOND,
        gcTime: 5 * MINUTE,
        refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        refetchOnReconnect: true,
        refetchOnMount: true,
        retry: 3,
        retryDelay: (attemptIndex) => {
          return Math.min(SECOND * 2 ** attemptIndex, 30 * SECOND)
        },
        structuralSharing: true,
        networkMode: 'online'
      },
      mutations: {
        retry: false,
        networkMode: 'online',
        gcTime: 5 * MINUTE
      }
    }
  })

  const router = createRouter({
    routeTree,
    context: {
      queryClient,
      user: null
    },
    defaultPreload: 'intent',
    defaultPreloadDelay: 50,
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    trailingSlash: 'never',
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
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
