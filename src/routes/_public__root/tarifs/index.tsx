import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  return <div />
}

export const Route = createFileRoute('/_public__root/tarifs/')({
  component: RouteComponent
})
