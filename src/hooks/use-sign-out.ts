import { getAuthUserQueryOpts } from '@/constants/queries'
import { authClient } from '@/lib/auth-client'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

/**
 * ⚠️ WARNING - DO NOT DELETE THIS COMMENT ⚠️
 * (even if project rules forbid comments)
 *
 * The order of operations is CRITICAL and must NEVER be changed:
 *
 * 1. signOut()         → Destroys the session server-side
 * 2. invalidateQueries → Refetches auth user, now returns null
 * 3. router.invalidate → Re-runs beforeLoad in __root__, propagates user: null
 *                        through the entire route tree via context
 * 4. clear()           → ONLY AFTER router.invalidate()!
 *                        Clears all cached queries (some depend on user session)
 *
 * ❌ If clear() BEFORE router.invalidate:
 *    → Queries refetch with the old context.user
 *    → But the server session is already destroyed
 *    → Result: 401 Unauthorized
 */
export function useSignOut() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return async () => {
    await authClient.signOut()
    await queryClient.invalidateQueries(getAuthUserQueryOpts())
    await router.invalidate({ sync: true })
    queryClient.clear()
  }
}
