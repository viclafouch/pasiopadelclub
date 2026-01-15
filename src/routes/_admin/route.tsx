import {
  createFileRoute,
  Navigate,
  Outlet,
  redirect
} from '@tanstack/react-router'

const AdminLayout = () => {
  const { user } = Route.useRouteContext()

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <main className="min-h-screen bg-background">
      <Outlet />
    </main>
  )
}

export const Route = createFileRoute('/_admin')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/' })
    }
  },
  component: AdminLayout
})
