import React from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from 'lucide-react'
import { z } from 'zod'
import { FormErrorAlert, FormField } from '@/components/form-field'
import { LoadingButton } from '@/components/loading-button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { strongPasswordSchema } from '@/constants/schemas'
import { getAuthErrorMessage } from '@/helpers/auth-errors'
import { authClient } from '@/lib/auth-client'
import { seo } from '@/utils/seo'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

const searchSchema = z.object({
  token: z.string().optional(),
  error: z.string().optional()
})

const resetPasswordSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string()
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword
    },
    {
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword']
    }
  )

const ResetPasswordPage = () => {
  const { token, error: urlError } = Route.useSearch()
  const [isPasswordReset, setIsPasswordReset] = React.useState(false)

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { password: string }) => {
      if (!token) {
        throw new Error('INVALID_TOKEN')
      }

      const { error } = await authClient.resetPassword({
        newPassword: data.password,
        token
      })

      if (error) {
        throw new Error(error.code)
      }
    },
    onSuccess: () => {
      setIsPasswordReset(true)
    }
  })

  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
    validators: {
      onSubmit: resetPasswordSchema
    },
    onSubmit: ({ value }) => {
      if (!resetPasswordMutation.isPending) {
        resetPasswordMutation.mutate({ password: value.password })
      }
    }
  })

  if (urlError === 'INVALID_TOKEN' || (!token && !isPasswordReset)) {
    return (
      <div className="space-y-8">
        <div>
          <h1
            id="auth-form"
            className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          >
            Lien invalide
          </h1>
          <p className="mt-2 text-muted-foreground">
            Ce lien de réinitialisation a expiré ou est invalide
          </p>
        </div>
        <Alert variant="destructive">
          <XCircle className="size-4" aria-hidden="true" />
          <AlertDescription>
            Le lien de réinitialisation n&apos;est plus valide. Les liens
            expirent après 1 heure. Veuillez faire une nouvelle demande.
          </AlertDescription>
        </Alert>
        <div className="space-y-3">
          <Link
            to="/mot-de-passe-oublie"
            className="flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
            Demander un nouveau lien
          </Link>
          <Link
            to="/connexion"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  if (isPasswordReset) {
    return (
      <div className="space-y-8">
        <div>
          <h1
            id="auth-form"
            className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          >
            Mot de passe modifié
          </h1>
          <p className="mt-2 text-muted-foreground">
            Votre mot de passe a été réinitialisé avec succès
          </p>
        </div>
        <Alert>
          <CheckCircle className="size-4 text-green-600" aria-hidden="true" />
          <AlertDescription>
            Vous pouvez maintenant vous connecter avec votre nouveau mot de
            passe.
          </AlertDescription>
        </Alert>
        <Link
          to="/connexion"
          className="flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
          Se connecter
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Nouveau mot de passe
        </h1>
        <p className="mt-2 text-muted-foreground">
          Choisissez un nouveau mot de passe pour votre compte
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
        <form.Field name="password">
          {(field) => {
            return (
              <FormField
                field={field}
                label="Nouveau mot de passe"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            )
          }}
        </form.Field>
        <form.Field name="confirmPassword">
          {(field) => {
            return (
              <FormField
                field={field}
                label="Confirmer le mot de passe"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            )
          }}
        </form.Field>
        {resetPasswordMutation.error ? (
          <FormErrorAlert
            message={getAuthErrorMessage(resetPasswordMutation.error.message)}
          />
        ) : null}
        <LoadingButton
          type="submit"
          size="lg"
          className="w-full"
          isLoading={resetPasswordMutation.isPending}
          loadingText="Réinitialisation..."
        >
          Réinitialiser le mot de passe
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

export const Route = createFileRoute('/_auth/reinitialiser-mot-de-passe')({
  validateSearch: searchSchema,
  component: ResetPasswordPage,
  head: () => {
    const seoData = seo({
      title: 'Réinitialiser le mot de passe',
      description:
        'Définissez un nouveau mot de passe pour votre compte Pasio Padel Club.',
      pathname: '/reinitialiser-mot-de-passe'
    })

    return {
      meta: [{ name: 'robots', content: 'noindex,nofollow' }, ...seoData.meta],
      links: seoData.links
    }
  }
})
