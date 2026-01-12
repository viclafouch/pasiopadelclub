import { SignUp } from '@clerk/tanstack-react-start'
import { shadcn } from '@clerk/themes'
import { createFileRoute } from '@tanstack/react-router'

const InscriptionPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <SignUp appearance={{ theme: shadcn }} signInUrl="/connexion" />
    </main>
  )
}

export const Route = createFileRoute('/_auth/inscription/')({
  component: InscriptionPage,
  head: () => {
    return {
      meta: [
        { title: 'Inscription | Pasio Padel Club - Anglet' },
        {
          name: 'description',
          content:
            'Créez votre compte Pasio Padel Club pour réserver vos créneaux de padel en ligne à Anglet.'
        }
      ]
    }
  }
})
