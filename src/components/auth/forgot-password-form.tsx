import React from 'react'
import { ArrowLeft, CheckCircle2, Mail, Send } from 'lucide-react'
import { z } from 'zod/v3'
import { FormField } from '@/components/auth/form-field'
import { Button } from '@/components/ui/button'
import { useAuthActions } from '@convex-dev/auth/react'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

const emailSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse email valide')
})

const resetSchema = z
  .object({
    code: z.string().length(8, 'Le code doit contenir 8 chiffres'),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
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

type EmailFormValues = z.infer<typeof emailSchema>
type ResetFormValues = z.infer<typeof resetSchema>

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = String(error.message)

    if (message.includes('Could not send')) {
      return "Impossible d'envoyer l'email. Vérifiez l'adresse email."
    }

    if (message.includes('Invalid code') || message.includes('invalid')) {
      return 'Code invalide ou expiré'
    }

    return message
  }

  return 'Une erreur est survenue'
}

const SuccessState = () => {
  return (
    <div role="status" className="flex flex-col items-center py-8 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden="true" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-foreground">
        Mot de passe réinitialisé
      </h2>
      <p className="text-muted-foreground">
        Votre mot de passe a été modifié avec succès.
      </p>
      <Link to="/connexion" className="mt-6 text-primary hover:underline">
        Se connecter
      </Link>
    </div>
  )
}

export const ForgotPasswordForm = () => {
  const [step, setStep] = React.useState<'email' | 'reset'>('email')
  const [email, setEmail] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const { signIn } = useAuthActions()

  const sendCodeMutation = useMutation({
    mutationFn: async (values: EmailFormValues) => {
      try {
        await signIn('password', {
          email: values.email,
          flow: 'reset'
        })
      } catch {
        // Silently ignore errors to prevent email enumeration attacks
        // We always show the same message regardless of whether the email exists
      }
    },
    onSuccess: () => {
      setStep('reset')
    }
  })

  const resetMutation = useMutation({
    mutationFn: async (values: ResetFormValues) => {
      await signIn('password', {
        email,
        code: values.code,
        newPassword: values.password,
        flow: 'reset-verification'
      })
    }
  })

  const emailForm = useForm({
    defaultValues: { email: '' },
    validators: { onSubmit: emailSchema },
    onSubmit: async ({ value }) => {
      setEmail(value.email)
      sendCodeMutation.mutate(value)
    }
  })

  const resetForm = useForm({
    defaultValues: { code: '', password: '', confirmPassword: '' },
    validators: { onSubmit: resetSchema },
    onSubmit: async ({ value }) => {
      resetMutation.mutate(value)
    }
  })

  if (resetMutation.isSuccess) {
    return <SuccessState />
  }

  if (step === 'email') {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          emailForm.handleSubmit()
        }}
        className="space-y-5"
        noValidate
      >
        <p className="text-muted-foreground">
          Entrez votre adresse email et nous vous enverrons un code pour
          réinitialiser votre mot de passe.
        </p>
        {sendCodeMutation.isError ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {getErrorMessage(sendCodeMutation.error)}
          </div>
        ) : null}
        <emailForm.Field name="email">
          {(field) => {
            return (
              <FormField
                label="Adresse email"
                name="email"
                type="email"
                placeholder="jean@exemple.fr"
                autoComplete="email"
                field={field}
              />
            )
          }}
        </emailForm.Field>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={sendCodeMutation.isPending}
          aria-busy={sendCodeMutation.isPending}
        >
          {sendCodeMutation.isPending ? (
            <span className="flex items-center gap-2">
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden="true"
              />
              Envoi en cours...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Envoyer le code
            </span>
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/connexion" className="text-primary hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </form>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        resetForm.handleSubmit()
      }}
      className="space-y-5"
      noValidate
    >
      <div className="rounded-lg bg-primary/10 p-3 text-sm">
        <p className="text-foreground">
          Si un compte existe avec l&apos;adresse <strong>{email}</strong>, vous
          recevrez un code à 8 chiffres par email.
        </p>
      </div>
      {resetMutation.isError ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {getErrorMessage(resetMutation.error)}
        </div>
      ) : null}
      <resetForm.Field name="code">
        {(field) => {
          return (
            <FormField
              label="Code de vérification"
              name="code"
              type="text"
              placeholder="12345678"
              autoComplete="one-time-code"
              maxLength={8}
              inputMode="numeric"
              field={field}
            />
          )
        }}
      </resetForm.Field>
      <resetForm.Field name="password">
        {(field) => {
          return (
            <FormField
              label="Nouveau mot de passe"
              name="password"
              type="password"
              placeholder="Minimum 8 caractères"
              autoComplete="new-password"
              field={field}
              showPasswordToggle
              isPasswordVisible={showPassword}
              onTogglePassword={() => {
                return setShowPassword(!showPassword)
              }}
            />
          )
        }}
      </resetForm.Field>
      <resetForm.Field name="confirmPassword">
        {(field) => {
          return (
            <FormField
              label="Confirmer le mot de passe"
              name="confirmPassword"
              type="password"
              placeholder="Retapez votre mot de passe"
              autoComplete="new-password"
              field={field}
              showPasswordToggle
              isPasswordVisible={showConfirmPassword}
              onTogglePassword={() => {
                return setShowConfirmPassword(!showConfirmPassword)
              }}
            />
          )
        }}
      </resetForm.Field>
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={resetMutation.isPending}
        aria-busy={resetMutation.isPending}
      >
        {resetMutation.isPending ? (
          <span className="flex items-center gap-2">
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            Réinitialisation...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" aria-hidden="true" />
            Réinitialiser le mot de passe
          </span>
        )}
      </Button>
      <button
        type="button"
        onClick={() => {
          setStep('email')
          sendCodeMutation.reset()
        }}
        className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Renvoyer un code
      </button>
    </form>
  )
}
