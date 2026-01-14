import { auth } from '@clerk/tanstack-react-start/server'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

export const authStateFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { isAuthenticated, userId, getToken } = await auth()
    const token = await getToken({ template: 'convex' })

    return {
      userId,
      isAuthenticated,
      token
    }
  }
)

export type AuthState = Awaited<ReturnType<typeof authStateFn>>

export const authQueryOptions = queryOptions({
  queryKey: ['auth'],
  queryFn: () => {
    return authStateFn()
  },
  staleTime: Infinity
})
