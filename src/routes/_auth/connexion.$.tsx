import { z } from 'zod'
import { seo } from '@/utils/seo'
import { SignIn } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'

const searchSchema = z.object({
  redirect: z.string().optional()
})

const ConnexionPage = () => {
  const { redirect: redirectQuery } = Route.useSearch()

  const isValidInternalPath =
    redirectQuery &&
    redirectQuery.startsWith('/') &&
    !redirectQuery.startsWith('//')
  const safeRedirect = isValidInternalPath ? redirectQuery : '/'

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <SignIn signUpUrl="/inscription" forceRedirectUrl={safeRedirect} />
    </main>
  )
}

export const Route = createFileRoute('/_auth/connexion/$')({
  validateSearch: searchSchema,
  component: ConnexionPage,
  head: () => {
    return {
      meta: seo({
        title: 'Connexion',
        description:
          'Connectez-vous à votre compte Pasio Padel Club pour réserver vos créneaux de padel à Anglet.',
        pathname: '/connexion'
      })
    }
  }
})
