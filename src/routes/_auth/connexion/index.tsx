import { SignIn } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'

const ConnexionPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <SignIn signUpUrl="/inscription" />
    </main>
  )
}

export const Route = createFileRoute('/_auth/connexion/')({
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
