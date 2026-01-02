import { Navbar } from '@/components/navbar'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <div>
      <Navbar className="static bg-primary text-primary-foreground" />
    </div>
  )
}

export const Route = createFileRoute('/_public__root/tarifs')({
  component: RouteComponent
})
