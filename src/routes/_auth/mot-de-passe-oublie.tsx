import React from 'react'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import { z } from 'zod'
import { FormErrorAlert, FormField } from '@/components/form-field'
import { LoadingButton } from '@/components/loading-button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { emailSchema } from '@/constants/schemas'
import { getAuthErrorMessage } from '@/helpers/auth-errors'
import { authClient } from '@/lib/auth-client'
import { seo } from '@/utils/seo'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

const forgotPasswordSchema = z.object({
  email: emailSchema
})

const ForgotPasswordPage = () => {
  const [isEmailSent, setIsEmailSent] = React.useState(false)

  const requestResetMutation = useMutation({
    mutationFn: async (data: z.infer<typeof forgotPasswordSchema>) => {
      const { error } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: '/reinitialiser-mot-de-passe'
      })

      if (error) {
        throw new Error(error.code)
      }
    },
    onSuccess: () => {
      setIsEmailSent(true)
    }
  })

  const form = useForm({
    defaultValues: {
      email: ''
    },
    validators: {
      onSubmit: forgotPasswordSchema
    },
    onSubmit: ({ value }) => {
      if (!requestResetMutation.isPending) {
        requestResetMutation.mutate(value)
      }
    }
  })

  if (isEmailSent) {
    return (
      <div className="space-y-8">
        <div>
          <h1
            id="auth-form"
            className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          >
            Email envoyé
          </h1>
          <p className="mt-2 text-muted-foreground">
            Consultez votre boîte de réception
          </p>
        </div>
        <Alert>
          <CheckCircle className="size-4 text-green-600" aria-hidden="true" />
          <AlertDescription>
            Si un compte existe avec cette adresse email, vous recevrez un lien
            pour réinitialiser votre mot de passe. Le lien expire dans 1 heure.
          </AlertDescription>
        </Alert>
        <div className="space-y-3">
          <Link
            to="/connexion"
            className="flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Mot de passe oublié
        </h1>
        <p className="mt-2 text-muted-foreground">
          Entrez votre email pour recevoir un lien de réinitialisation
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
                required
              />
            )
          }}
        </form.Field>
        {requestResetMutation.error ? (
          <FormErrorAlert
            message={getAuthErrorMessage(requestResetMutation.error.message)}
          />
        ) : null}
        <LoadingButton
          type="submit"
          size="lg"
          className="w-full"
          isLoading={requestResetMutation.isPending}
          loadingText="Envoi en cours..."
        >
          Envoyer le lien
          <ArrowRight className="size-4" aria-hidden="true" />
        </LoadingButton>
      </form>
      <Link
        to="/connexion"
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Retour à la connexion
      </Link>
    </div>
  )
}

export const Route = createFileRoute('/_auth/mot-de-passe-oublie')({
  component: ForgotPasswordPage,
  head: () => {
    return {
      ...seo({
        title: 'Mot de passe oublié | Réinitialisation',
        description:
          'Réinitialisez votre mot de passe Pasio Padel Club. Recevez un lien par email pour définir un nouveau mot de passe.',
        keywords: 'mot de passe oublié padel, réinitialiser mot de passe',
        pathname: '/mot-de-passe-oublie'
      })
    }
  }
})
