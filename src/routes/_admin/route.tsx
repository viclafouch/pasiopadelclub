import { useConvexAuth } from 'convex/react'
import { LoaderIcon } from 'lucide-react'
import { api } from '~/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

const AdminContent = () => {
  const userQuery = useSuspenseQuery(convexQuery(api.users.getCurrent, {}))

  if (!userQuery.data || userQuery.data.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

const AdminLayout = () => {
  const { isLoading, isAuthenticated } = useConvexAuth()

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="min-h-screen bg-background">
      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <LoaderIcon
            className="size-8 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      ) : (
        <AdminContent />
      )}
    </main>
  )
}

export const Route = createFileRoute('/_admin')({
  component: AdminLayout
})
