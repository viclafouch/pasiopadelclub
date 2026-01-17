import { auth } from '@/lib/auth'
import { createMiddleware } from '@tanstack/react-start'
import {
  getRequestHeaders,
  setResponseStatus
} from '@tanstack/react-start/server'

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      setResponseStatus(401)
      throw new Error('Non authentifié')
    }

    return next({ context: { session } })
  }
)

export const activeUserMiddleware = createMiddleware({ type: 'function' })
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    if (context.session.user.isBlocked) {
      setResponseStatus(403)
      throw new Error('Action non autorisée')
    }

    return next()
  })
