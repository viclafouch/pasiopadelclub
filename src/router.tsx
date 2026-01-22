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
        refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        staleTime: 1000 * 60 * 2 // 2min
      },
      mutations: {
        retry: false
      }
    }
  })

  const router = createRouter({
    routeTree,
    context: {
      queryClient,
      user: null
    },
    scrollRestoration: false,
    defaultPreloadStaleTime: 0
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
