import React from 'react'
import { useConvexAuth } from 'convex/react'
import { Navbar } from '@/components/navbar'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { api } from '../../../convex/_generated/api'

const LoadingState = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

const AdminLayout = () => {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth()
  const { data: user, isLoading: isUserLoading } = useQuery(
    convexQuery(api.users.getCurrent, {})
  )
  const navigate = useNavigate()

  const isLoading = isAuthLoading || isUserLoading

  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'admin')) {
      navigate({ to: '/' })
    }
  }, [isLoading, isAuthenticated, user, navigate])

  if (isLoading || !isAuthenticated || !user || user.role !== 'admin') {
    return <LoadingState />
  }

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
  component: AdminLayout
})
