import { authStateFn } from '@/server/auth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const { isAuthenticated } = await authStateFn()

    if (isAuthenticated) {
      throw redirect({ to: '/', replace: true })
    }
  },
  component: Outlet
})
