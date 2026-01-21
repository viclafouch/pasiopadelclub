import { AlertCircle, ArrowRight } from 'lucide-react'
import { z } from 'zod'
import { FormField } from '@/components/form-field'
import { LoadingButton } from '@/components/loading-button'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { AuthPageLayout } from './-components/auth-page-layout'

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

  const isInternalPath =
    redirectQuery?.startsWith('/') && !redirectQuery.startsWith('//')
  const safeRedirect = isInternalPath ? redirectQuery : '/'

  const signInMutation = useMutation({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
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
    <AuthPageLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Connexion
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link
              to="/inscription"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Créer un compte
            </Link>
          </p>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-5"
        >
          <form.Field name="email">
            {(field) => {
              return (
                <FormField
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="jean.dupont@email.com"
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
          <LoadingButton
            type="submit"
            size="lg"
            className="w-full"
            isLoading={signInMutation.isPending}
            loadingText="Connexion..."
          >
            Se connecter
            <ArrowRight className="size-4" aria-hidden="true" />
          </LoadingButton>
        </form>
      </div>
    </AuthPageLayout>
  )
}

export const Route = createFileRoute('/_auth/connexion')({
  validateSearch: searchSchema,
  component: ConnexionPage,
  head: () => {
    return {
      meta: seo({
        title: 'Connexion | Accédez à votre compte',
        description:
          'Connectez-vous à votre compte Pasio Padel Club pour réserver vos créneaux de padel à Bayonne. Accédez à vos réservations et à votre historique.',
        keywords:
          'connexion padel bayonne, se connecter padel, espace membre padel',
        pathname: '/connexion'
      })
    }
  }
})
