import { Navbar } from '@/components/navbar'
import { createFileRoute } from '@tanstack/react-router'

const CgvPage = () => {
  return (
    <>
      <Navbar className="static bg-primary text-primary-foreground" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Conditions Générales de Vente</h1>
        <p className="mt-4 text-muted-foreground">
          Page en cours de construction.
        </p>
      </main>
    </>
  )
}

export const Route = createFileRoute('/_public__root/cgv/')({
  component: CgvPage
})
