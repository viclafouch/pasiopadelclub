import { AlertCircle } from 'lucide-react'
import { z } from 'zod'
import { FormField } from '@/components/form-field'
import { LoadingButton } from '@/components/loading-button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { getAuthUserQueryOpts } from '@/constants/queries'
import { getAuthErrorMessage } from '@/helpers/auth-errors'
import { authClient } from '@/lib/auth-client'
import { seo } from '@/utils/seo'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter
} from '@tanstack/react-router'

const signUpSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.email(),
  password: z.string().min(8)
})

const InscriptionPage = () => {
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()

  const signUpMutation = useMutation({
    mutationFn: async (data: {
      firstName: string
      lastName: string
      email: string
      password: string
    }) => {
      const { error } = await authClient.signUp.email({
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      })

      if (error) {
        throw new Error(error.code)
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(getAuthUserQueryOpts())
      await router.invalidate()
      navigate({ to: '/' })
    }
  })

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
    validators: {
      onSubmit: signUpSchema
    },
    onSubmit: ({ value }) => {
      if (!signUpMutation.isPending) {
        signUpMutation.mutate(value)
      }
    }
  })

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Inscription</CardTitle>
          <CardDescription>Créez votre compte Pasio Padel Club</CardDescription>
        </CardHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="firstName">
                {(field) => {
                  return (
                    <FormField
                      field={field}
                      label="Prénom"
                      placeholder="Prénom"
                    />
                  )
                }}
              </form.Field>
              <form.Field name="lastName">
                {(field) => {
                  return (
                    <FormField field={field} label="Nom" placeholder="Nom" />
                  )
                }}
              </form.Field>
            </div>
            <form.Field name="email">
              {(field) => {
                return (
                  <FormField
                    field={field}
                    label="Email"
                    type="email"
                    placeholder="votre@email.com"
                  />
                )
              }}
            </form.Field>
            <form.Field name="password">
              {(field) => {
                return (
                  <FormField
                    field={field}
                    label="Mot de passe"
                    type="password"
                    placeholder="••••••••"
                  />
                )
              }}
            </form.Field>
            {signUpMutation.error ? (
              <Alert variant="destructive">
                <AlertCircle className="size-4" aria-hidden="true" />
                <AlertDescription>
                  {getAuthErrorMessage(signUpMutation.error.message)}
                </AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-6">
            <LoadingButton
              type="submit"
              className="w-full"
              isLoading={signUpMutation.isPending}
              loadingText="Création..."
            >
              Créer mon compte
            </LoadingButton>
            <p className="text-sm text-muted-foreground">
              Déjà un compte ?{' '}
              <Link
                to="/connexion"
                className="text-primary underline-offset-4 hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}

export const Route = createFileRoute('/_auth/inscription')({
  component: InscriptionPage,
  head: () => {
    return {
      meta: seo({
        title: 'Inscription',
        description:
          'Créez votre compte Pasio Padel Club pour réserver vos créneaux de padel en ligne à Anglet.',
        pathname: '/inscription'
      })
    }
  }
})
