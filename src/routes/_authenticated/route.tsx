import React from 'react'
import { useConvexAuth } from 'convex/react'
import { Navbar } from '@/components/navbar'
import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate
} from '@tanstack/react-router'

const LoadingState = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

const AuthenticatedLayout = () => {
  const { isLoading, isAuthenticated } = useConvexAuth()
  const navigate = useNavigate()
  const location = useLocation()

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({
        to: '/connexion',
        search: { redirect: location.pathname }
      })
    }
  }, [isLoading, isAuthenticated, navigate, location.pathname])

  if (isLoading || !isAuthenticated) {
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

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout
})
