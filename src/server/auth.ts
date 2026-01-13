import { auth } from '@clerk/tanstack-react-start/server'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

export const authStateFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { userId, getToken } = await auth()
    const token = await getToken({ template: 'convex' })

    return {
      isAuthenticated: Boolean(userId && token),
      userId,
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
