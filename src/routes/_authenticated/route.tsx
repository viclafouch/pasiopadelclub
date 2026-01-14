import { useConvexAuth } from 'convex/react'
import { LoaderIcon } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import {
  createFileRoute,
  Navigate,
  Outlet,
  useLocation
} from '@tanstack/react-router'

const AuthenticatedLayout = () => {
  const { isLoading, isAuthenticated } = useConvexAuth()

  const location = useLocation()

  if (!isLoading && !isAuthenticated) {
    return (
      <Navigate to="/connexion/$" search={{ redirect: location.pathname }} />
    )
  }

  return (
    <>
      <Navbar variant="solid" />
      <main className="min-h-screen bg-background">
        {isLoading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <LoaderIcon
              className="size-8 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout
})
