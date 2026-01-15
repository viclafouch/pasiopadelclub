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

const signUpSchema = z.object({
  firstName: z.string().min(2, '2 caractères minimum'),
  lastName: z.string().min(2, '2 caractères minimum'),
  email: z.email('Email invalide'),
  password: z.string().min(8, '8 caractères minimum')
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
        throw new Error(error.message)
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
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Prénom</Label>
                      <Input
                        id={field.name}
                        type="text"
                        placeholder="Prénom"
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
              <form.Field name="lastName">
                {(field) => {
                  return (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Nom</Label>
                      <Input
                        id={field.name}
                        type="text"
                        placeholder="Nom"
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
            </div>
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
            {signUpMutation.error ? (
              <p className="text-sm text-destructive" role="alert">
                {getErrorMessage(signUpMutation.error)}
              </p>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button
              type="submit"
              className="w-full"
              aria-busy={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? 'Création...' : 'Créer mon compte'}
            </Button>
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
