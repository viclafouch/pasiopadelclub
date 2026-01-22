import { ArrowRight } from 'lucide-react'
import { z } from 'zod'
import { FormErrorAlert, FormField } from '@/components/form-field'
import { LoadingButton } from '@/components/loading-button'
import { emailSchema } from '@/constants/schemas'
import { getAuthErrorMessage } from '@/helpers/auth-errors'
import { getSafeRedirect } from '@/helpers/url'
import { authClient } from '@/lib/auth-client'
import { seo } from '@/utils/seo'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8)
})

const ConnexionPage = () => {
  const { redirect: redirectQuery } = Route.useSearch()
  const safeRedirect = getSafeRedirect(redirectQuery)

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
    onSuccess: () => {
      window.location.href = safeRedirect
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
    <div className="space-y-8">
      <div>
        <h1
          id="auth-form"
          className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
        >
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
        noValidate
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
                spellCheck={false}
                required
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
                required
              />
            )
          }}
        </form.Field>
        <div className="flex justify-end">
          <Link
            to="/mot-de-passe-oublie"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        {signInMutation.error ? (
          <FormErrorAlert
            message={getAuthErrorMessage(signInMutation.error.message)}
          />
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
  )
}

export const Route = createFileRoute('/_auth/connexion')({
  component: ConnexionPage,
  head: () => {
    return {
      ...seo({
        title: 'Connexion',
        description:
          'Connectez-vous à Pasio Padel Club pour réserver vos créneaux de padel à Bayonne. Accédez à vos réservations et votre historique.',
        keywords:
          'connexion padel bayonne, se connecter padel, espace membre padel',
        pathname: '/connexion'
      })
    }
  }
})
