import React from 'react'
import { getAuthUserQueryOpts } from '@/constants/queries'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

type AuthEvent = 'login' | 'logout'

const CHANNEL_NAME = 'auth-sync'

function getOrCreateChannel() {
  if (typeof window === 'undefined') {
    return null
  }

  return new BroadcastChannel(CHANNEL_NAME)
}

export function broadcastAuthEvent(event: AuthEvent) {
  getOrCreateChannel()?.postMessage(event)
}

export function useAuthSync() {
  const queryClient = useQueryClient()
  const router = useRouter()

  React.useEffect(() => {
    const channel = getOrCreateChannel()

    if (!channel) {
      return undefined
    }

    const handleMessage = async (event: MessageEvent<AuthEvent>) => {
      switch (event.data) {
        case 'logout':
          queryClient.removeQueries(getAuthUserQueryOpts())
          await router.invalidate()
          break
        case 'login':
          await queryClient.invalidateQueries(getAuthUserQueryOpts())
          await router.invalidate()
          break
        default:
          break
      }
    }

    channel.addEventListener('message', handleMessage)

    return () => {
      channel.removeEventListener('message', handleMessage)
      channel.close()
    }
  }, [queryClient, router])
}
