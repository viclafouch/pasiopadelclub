import React from 'react'
import { LogIn } from 'lucide-react'
import { z } from 'zod/v3'
import { FormField } from '@/components/auth/form-field'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useAuthActions } from '@convex-dev/auth/react'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'

const loginSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse email valide'),
  password: z.string().min(1, 'Veuillez entrer votre mot de passe'),
  rememberMe: z.boolean()
})

type LoginFormValues = z.infer<typeof loginSchema>

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = String(error.message)

    if (
      message.includes('Invalid credentials') ||
      message.includes('invalid')
    ) {
      return 'Email ou mot de passe incorrect'
    }

    return message
  }

  return 'Une erreur est survenue lors de la connexion'
}

export const LoginForm = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { redirect?: string }
  const { signIn } = useAuthActions()

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      await signIn('password', {
        email: values.email,
        password: values.password,
        flow: 'signIn'
      })
    },
    onSuccess: () => {
      const redirectTo = search.redirect ?? '/'
      navigate({ to: redirectTo })
    }
  })

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validators: {
      onSubmit: loginSchema
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutate({
        email: value.email,
        password: value.password,
        rememberMe: value.rememberMe
      })
    }
  })

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
      {loginMutation.isError ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {getErrorMessage(loginMutation.error)}
        </div>
      ) : null}
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
      <form.Field name="password">
        {(field) => {
          return (
            <FormField
              label="Mot de passe"
              name="password"
              type="password"
              placeholder="Votre mot de passe"
              autoComplete="current-password"
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
      <div className="flex items-center justify-between">
        <form.Field name="rememberMe">
          {(field) => {
            return (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="rememberMe"
                  checked={field.state.value}
                  onCheckedChange={(checked) => {
                    return field.handleChange(checked === true)
                  }}
                />
                <Label htmlFor="rememberMe" className="cursor-pointer">
                  Se souvenir de moi
                </Label>
              </div>
            )
          }}
        </form.Field>
        <Link
          to="/mot-de-passe-oublie"
          className="text-sm text-primary hover:underline"
        >
          Mot de passe oublié ?
        </Link>
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loginMutation.isPending}
        aria-busy={loginMutation.isPending}
      >
        {loginMutation.isPending ? (
          <span className="flex items-center gap-2">
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            Connexion en cours...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Se connecter
          </span>
        )}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{' '}
        <Link to="/inscription" className="text-primary hover:underline">
          Créer un compte
        </Link>
      </p>
    </form>
  )
}
