import { Navbar } from '@/components/navbar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

const AdminLayout = () => {
  return (
    <>
      <Navbar className="static bg-primary text-primary-foreground" />
      <main className="min-h-screen bg-background">
        <Outlet />
      </main>
    </>
  )
}

export const Route = createFileRoute('/_admin')({
  beforeLoad: async ({ context }) => {
    if (!context.user || context.user.role !== 'admin') {
      throw redirect({ to: '/' })
    }
  },
  component: AdminLayout
})
