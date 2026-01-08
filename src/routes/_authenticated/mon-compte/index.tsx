import { createFileRoute } from '@tanstack/react-router'

const MonComptePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Mon compte</h1>
      <p className="mt-4 text-muted-foreground">
        Page en cours de construction.
      </p>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/mon-compte/')({
  component: MonComptePage
})
