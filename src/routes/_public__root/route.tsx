import { createFileRoute, Outlet } from '@tanstack/react-router'

const PublicLayout = () => {
  return <Outlet />
}

export const Route = createFileRoute('/_public__root')({
  component: PublicLayout
})
