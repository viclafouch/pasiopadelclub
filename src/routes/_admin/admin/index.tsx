import { seo } from '@/utils/seo'
import { createFileRoute } from '@tanstack/react-router'

const AdminPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Administration</h1>
      <p className="mt-4 text-muted-foreground">
        Page en cours de construction.
      </p>
    </div>
  )
}

export const Route = createFileRoute('/_admin/admin/')({
  component: AdminPage,
  head: () => {
    return {
      meta: seo({
        title: 'Administration',
        description: "Panneau d'administration de Pasio Padel Club.",
        pathname: '/admin'
      })
    }
  }
})
