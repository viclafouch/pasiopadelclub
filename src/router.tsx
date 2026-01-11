import { ConvexReactClient } from 'convex/react'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { clientEnv } from './env/client'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const convexClient = new ConvexReactClient(clientEnv.VITE_CONVEX_URL)
  const convexQueryClient = new ConvexQueryClient(convexClient)

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
      queryClient
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    Wrap: ({ children }) => {
      return (
        <ConvexAuthProvider client={convexClient}>
          {children}
        </ConvexAuthProvider>
      )
    }
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient
  })

  return router
}
