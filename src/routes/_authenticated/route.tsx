import { Navbar } from '@/components/navbar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

const AuthenticatedLayout = () => {
  return (
    <>
      <Navbar variant="solid" />
      <main className="min-h-screen bg-background pt-[var(--navbar-height)]">
        <Outlet />
      </main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: '/connexion',
        search: { redirect: location.pathname }
      })
    }

    return { user: context.user }
  },
  component: AuthenticatedLayout
})
