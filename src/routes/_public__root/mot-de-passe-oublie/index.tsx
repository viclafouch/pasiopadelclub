import { createFileRoute } from '@tanstack/react-router'

const MotDePasseOubliePage = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Mot de passe oublié</h1>
      <p className="mt-4 text-muted-foreground">
        Page en cours de construction.
      </p>
    </main>
  )
}

export const Route = createFileRoute('/_public__root/mot-de-passe-oublie/')({
  component: MotDePasseOubliePage
})
