import { ConvexProvider } from 'convex/react'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { clientEnv } from './env/client'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const convexUrl = clientEnv.VITE_CONVEX_URL
  const convexQueryClient = new ConvexQueryClient(convexUrl, {
    expectAuth: true
  })

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn()
      }
    }
  })

  convexQueryClient.connect(queryClient)

  const router = createRouter({
    routeTree,
    context: {
      queryClient,
      convexQueryClient,
      user: null,
      token: null
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    Wrap: ({ children }) => {
      return (
        <ConvexProvider client={convexQueryClient.convexClient}>
          {children}
        </ConvexProvider>
      )
    }
  })

  return router
}
