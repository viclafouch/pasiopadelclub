import { Navbar } from '@/components/navbar'
import { convexQuery } from '@convex-dev/react-query'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { api } from '../../../convex/_generated/api'

const AdminLayout = () => {
  return (
    <>
      <Navbar variant="solid" />
      <main className="min-h-screen bg-background">
        <Outlet />
      </main>
    </>
  )
}

export const Route = createFileRoute('/_admin')({
  component: AdminLayout,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(
      convexQuery(api.users.getCurrent, {})
    )

    if (!user || user.role !== 'admin') {
      throw redirect({ to: '/' })
    }
  }
})
