import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'

const PublicLayout = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className={isHomePage ? '' : 'pt-[var(--navbar-height)]'}>
      <Outlet />
    </div>
  )
}

export const Route = createFileRoute('/_public__root')({
  component: PublicLayout
})
