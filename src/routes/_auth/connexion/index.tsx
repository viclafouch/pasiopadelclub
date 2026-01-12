import { z } from 'zod'
import { SignIn } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'

const searchSchema = z.object({
  redirect: z.string().optional()
})

const ConnexionPage = () => {
  const { redirect } = Route.useSearch()

  const isValidInternalPath =
    redirect && redirect.startsWith('/') && !redirect.startsWith('//')
  const safeRedirect = isValidInternalPath ? redirect : '/'

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <SignIn signUpUrl="/inscription" forceRedirectUrl={safeRedirect} />
    </main>
  )
}

export const Route = createFileRoute('/_auth/connexion/')({
  validateSearch: searchSchema,
  component: ConnexionPage,
  head: () => {
    return {
      meta: [
        { title: 'Connexion | Pasio Padel Club - Anglet' },
        {
          name: 'description',
          content:
            'Connectez-vous à votre compte Pasio Padel Club pour réserver vos créneaux de padel à Anglet.'
        }
      ]
    }
  }
})
