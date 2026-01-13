import { Navbar } from '@/components/navbar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

const AuthenticatedLayout = () => {
  return (
    <>
      <Navbar variant="solid" />
      <main className="min-h-screen bg-background">
        <Outlet />
      </main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.authState?.isAuthenticated) {
      throw redirect({
        to: '/connexion',
        search: { redirect: location.pathname }
      })
    }
  },
  component: AuthenticatedLayout
})
