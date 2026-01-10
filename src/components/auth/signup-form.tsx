import React from 'react'
import { CheckCircle2, Eye, EyeOff, UserPlus } from 'lucide-react'
import { z } from 'zod/v3'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

const PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/

const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Veuillez entrer une adresse email valide'),
    phone: z
      .string()
      .regex(
        PHONE_REGEX,
        'Veuillez entrer un numéro de téléphone français valide'
      ),
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

type SignupFormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return 'Erreur de validation'
}

const formatError = (error: unknown): string => {
  const message =
    error instanceof Error ? error.message : 'Une erreur est survenue'

  if (
    message.includes('already exists') ||
    message.includes('already registered')
  ) {
    return 'Cette adresse email est déjà utilisée'
  }

  return message
}

type FormFieldProps = {
  label: string
  name: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  autoComplete?: React.HTMLInputAutoCompleteAttribute
  field: {
    state: { value: string; meta: { errors: unknown[] } }
    handleBlur: () => void
    handleChange: (value: string) => void
  }
  showPasswordToggle?: boolean
  isPasswordVisible?: boolean
  onTogglePassword?: () => void
}

const FormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  autoComplete,
  field,
  showPasswordToggle,
  isPasswordVisible,
  onTogglePassword
}: FormFieldProps) => {
  const hasError = field.state.meta.errors.length > 0
  const errorId = `${name}-error`

  function getInputType(): React.HTMLInputTypeAttribute {
    if (!showPasswordToggle) {
      return type
    }

    return isPasswordVisible ? 'text' : 'password'
  }

  const inputType = getInputType()

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <Input
          type={inputType}
          id={name}
          name={name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(event) => {
            return field.handleChange(event.target.value)
          }}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={cn('h-11', showPasswordToggle ? 'pr-12' : undefined)}
          placeholder={placeholder}
        />
        {showPasswordToggle ? (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={
              isPasswordVisible
                ? 'Masquer le mot de passe'
                : 'Afficher le mot de passe'
            }
          >
            {isPasswordVisible ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>
      {hasError ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {getErrorMessage(field.state.meta.errors[0])}
        </p>
      ) : null}
    </div>
  )
}

const SignupSuccess = () => {
  return (
    <div role="status" className="flex flex-col items-center py-8 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden="true" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-foreground">
        Vérifiez votre email
      </h2>
      <p className="text-muted-foreground">
        Un email de confirmation a été envoyé à votre adresse. Cliquez sur le
        lien pour activer votre compte.
      </p>
      <Link to="/connexion" className="mt-6 text-primary hover:underline">
        Aller à la page de connexion
      </Link>
    </div>
  )
}

export const SignupForm = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const signupMutation = useMutation({
    mutationFn: async (values: SignupFormValues) => {
      const { error } = await authClient.signUp.email({
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        callbackURL: '/connexion'
      })

      if (error) {
        throw new Error(error.message ?? 'Une erreur est survenue')
      }
    }
  })

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    },
    validators: {
      onChange: signupSchema
    },
    onSubmit: async ({ value }) => {
      signupMutation.mutate({
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        phone: value.phone,
        password: value.password
      })
    }
  })

  if (signupMutation.isSuccess) {
    return <SignupSuccess />
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-5"
      noValidate
    >
      {signupMutation.isError ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {formatError(signupMutation.error)}
        </div>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <form.Field name="firstName">
          {(field) => {
            return (
              <FormField
                label="Prénom"
                name="firstName"
                placeholder="Jean"
                autoComplete="given-name"
                field={field}
              />
            )
          }}
        </form.Field>
        <form.Field name="lastName">
          {(field) => {
            return (
              <FormField
                label="Nom"
                name="lastName"
                placeholder="Dupont"
                autoComplete="family-name"
                field={field}
              />
            )
          }}
        </form.Field>
      </div>
      <form.Field name="email">
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
      </form.Field>
      <form.Field name="phone">
        {(field) => {
          return (
            <FormField
              label="Téléphone"
              name="phone"
              type="tel"
              placeholder="06 12 34 56 78"
              autoComplete="tel"
              field={field}
            />
          )
        }}
      </form.Field>
      <form.Field name="password">
        {(field) => {
          return (
            <FormField
              label="Mot de passe"
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
      </form.Field>
      <form.Field name="confirmPassword">
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
      </form.Field>
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={signupMutation.isPending}
        aria-busy={signupMutation.isPending}
      >
        {signupMutation.isPending ? (
          <span className="flex items-center gap-2">
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            Création en cours...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Créer mon compte
          </span>
        )}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{' '}
        <Link to="/connexion" className="text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  )
}
