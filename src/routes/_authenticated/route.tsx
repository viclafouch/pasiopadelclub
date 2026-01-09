import { Navbar } from '@/components/navbar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

const AuthenticatedLayout = () => {
  return (
    <>
      <Navbar className="static bg-primary text-primary-foreground" />
      <main className="min-h-screen bg-background">
        <Outlet />
      </main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: '/',
        search: {
          redirectTo: location.pathname
        }
      })
    }
  },
  component: AuthenticatedLayout
})
