import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getAuthUserQueryOpts } from '@/constants/queries'
import { getErrorMessage } from '@/helpers/error'
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
  email: z.email('Email invalide'),
  password: z.string().min(8, '8 caractères minimum')
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
        throw new Error(error.message)
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
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Email</Label>
                    <Input
                      id={field.name}
                      type="email"
                      placeholder="votre@email.com"
                      value={field.state.value}
                      onChange={(event) => {
                        return field.handleChange(event.target.value)
                      }}
                      onBlur={field.handleBlur}
                      aria-invalid={field.state.meta.errors.length > 0}
                      aria-describedby={
                        field.state.meta.errors.length > 0
                          ? `${field.name}-error`
                          : undefined
                      }
                    />
                    {field.state.meta.errors.length > 0 ? (
                      <p
                        id={`${field.name}-error`}
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {String(field.state.meta.errors[0])}
                      </p>
                    ) : null}
                  </div>
                )
              }}
            </form.Field>
            <form.Field name="password">
              {(field) => {
                return (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Mot de passe</Label>
                    <Input
                      id={field.name}
                      type="password"
                      placeholder="••••••••"
                      value={field.state.value}
                      onChange={(event) => {
                        return field.handleChange(event.target.value)
                      }}
                      onBlur={field.handleBlur}
                      aria-invalid={field.state.meta.errors.length > 0}
                      aria-describedby={
                        field.state.meta.errors.length > 0
                          ? `${field.name}-error`
                          : undefined
                      }
                    />
                    {field.state.meta.errors.length > 0 ? (
                      <p
                        id={`${field.name}-error`}
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {String(field.state.meta.errors[0])}
                      </p>
                    ) : null}
                  </div>
                )
              }}
            </form.Field>
            {signInMutation.error ? (
              <p className="text-sm text-destructive" role="alert">
                {getErrorMessage(signInMutation.error)}
              </p>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button
              type="submit"
              className="w-full"
              aria-busy={signInMutation.isPending}
            >
              {signInMutation.isPending ? 'Connexion...' : 'Se connecter'}
            </Button>
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
