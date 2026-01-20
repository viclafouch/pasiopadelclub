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

const searchSchema = z.object({
  redirect: z.string().optional()
})

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
})

const ConnexionPage = () => {
  const { redirect: redirectQuery } = Route.useSearch()
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()

  const isValidInternalPath =
    redirectQuery &&
    redirectQuery.startsWith('/') &&
    !redirectQuery.startsWith('//')
  const safeRedirect = isValidInternalPath ? redirectQuery : '/'

  const signInMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const { error } = await authClient.signIn.email({
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
      navigate({ to: safeRedirect })
    }
  })

  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    validators: {
      onSubmit: loginSchema
    },
    onSubmit: ({ value }) => {
      if (!signInMutation.isPending) {
        signInMutation.mutate(value)
      }
    }
  })

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte Pasio Padel Club
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <CardContent className="space-y-4">
            <form.Field name="email">
              {(field) => {
                return (
                  <FormField
                    field={field}
                    label="Email"
                    type="email"
                    placeholder="votre@email.com"
                    autoComplete="email"
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
                    autoComplete="current-password"
                  />
                )
              }}
            </form.Field>
            {signInMutation.error ? (
              <Alert variant="destructive">
                <AlertCircle className="size-4" aria-hidden="true" />
                <AlertDescription>
                  {getAuthErrorMessage(signInMutation.error.message)}
                </AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-6">
            <LoadingButton
              type="submit"
              className="w-full"
              isLoading={signInMutation.isPending}
              loadingText="Connexion..."
            >
              Se connecter
            </LoadingButton>
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link
                to="/inscription"
                className="text-primary underline-offset-4 hover:underline"
              >
                Créer un compte
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}

export const Route = createFileRoute('/_auth/connexion')({
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
