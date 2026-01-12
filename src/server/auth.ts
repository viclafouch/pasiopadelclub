import { auth } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'

export const authStateFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { userId, getToken } = await auth()
    const token = await getToken()

    if (!userId || !token) {
      return null
    }

    return {
      token,
      userId
    }
  }
)
