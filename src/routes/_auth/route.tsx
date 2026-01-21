import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AUTH_BACKGROUND_IMAGE } from './constants'

const AuthLayout = () => {
  return (
    <div className="pt-[var(--navbar-height)]">
      <Outlet />
    </div>
  )
}

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/', replace: true })
    }
  },
  head: () => {
    return {
      links: [
        {
          rel: 'preload',
          href: AUTH_BACKGROUND_IMAGE,
          as: 'image',
          type: 'image/webp',
          fetchPriority: 'high'
        }
      ]
    }
  },
  component: AuthLayout
})
