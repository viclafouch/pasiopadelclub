import { Navbar } from '@/components/navbar'
import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'

const PublicLayout = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <>
      <Navbar variant={isHomePage ? 'overlay' : 'solid'} />
      <Outlet />
    </>
  )
}

export const Route = createFileRoute('/_public__root')({
  component: PublicLayout
})
