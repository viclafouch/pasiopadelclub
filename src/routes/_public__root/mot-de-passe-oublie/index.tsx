import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { createFileRoute } from '@tanstack/react-router'

const MotDePasseOubliePage = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="container relative">
          <div className="mx-auto max-w-md">
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Mot de passe oublié
              </h1>
              <p className="mt-3 text-muted-foreground">
                Réinitialisez votre mot de passe en quelques étapes.
              </p>
            </div>
            <div className="mt-8 rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export const Route = createFileRoute('/_public__root/mot-de-passe-oublie/')({
  component: MotDePasseOubliePage,
  head: () => {
    return {
      meta: [
        { title: 'Mot de passe oublié | Pasio Padel Club - Anglet' },
        {
          name: 'description',
          content:
            'Réinitialisez votre mot de passe pour accéder à votre compte Pasio Padel Club.'
        }
      ]
    }
  }
})
