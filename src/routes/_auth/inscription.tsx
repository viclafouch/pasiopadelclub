import { ArrowRight, Check } from 'lucide-react'
import { z } from 'zod'
import {
  FormCheckboxField,
  FormErrorAlert,
  FormField
} from '@/components/form-field'
import { LoadingButton } from '@/components/loading-button'
import { getAuthUserQueryOpts } from '@/constants/queries'
import {
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  strongPasswordSchema
} from '@/constants/schemas'
import { getAuthErrorMessage } from '@/helpers/auth-errors'
import { authClient } from '@/lib/auth-client'
import { seo } from '@/utils/seo'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'

const signUpSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  password: strongPasswordSchema,
  acceptTerms: z.boolean().refine((accepted) => {
    return accepted
  }, 'Vous devez accepter les conditions pour créer un compte')
})

const BENEFITS = [
  'Réservation instantanée',
  'Gestion en ligne',
  'Historique des parties',
  'Paiement sécurisé'
] as const

const InscriptionPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const signUpMutation = useMutation({
    mutationFn: async (data: z.infer<typeof signUpSchema>) => {
      const { error } = await authClient.signUp.email({
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      })

      if (error) {
        throw new Error(error.code)
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(getAuthUserQueryOpts())
      await router.invalidate({ sync: true })
      router.navigate({ to: '/' })
    }
  })

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      acceptTerms: false
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
    <div className="space-y-8">
      <div>
        <h1
          id="auth-form"
          className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
        >
          Créer un compte
        </h1>
        <p className="mt-2 text-muted-foreground">
          Déjà membre ?{' '}
          <Link
            to="/connexion"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Se connecter
          </Link>
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-3">
        {BENEFITS.map((benefit) => {
          return (
            <li
              key={benefit}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check
                  className="size-3 text-primary"
                  aria-hidden="true"
                  strokeWidth={3}
                />
              </div>
              {benefit}
            </li>
          )
        })}
      </ul>
      <form
        id="signup-form"
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-5"
        autoComplete="on"
        noValidate
      >
        <div className="grid gap-4 xs:grid-cols-2">
          <form.Field name="firstName">
            {(field) => {
              return (
                <FormField
                  field={field}
                  label="Prénom"
                  placeholder="Jean"
                  autoComplete="given-name"
                  required
                />
              )
            }}
          </form.Field>
          <form.Field name="lastName">
            {(field) => {
              return (
                <FormField
                  field={field}
                  label="Nom"
                  placeholder="Dupont"
                  autoComplete="family-name"
                  required
                />
              )
            }}
          </form.Field>
        </div>
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
                placeholder="Min 8 car., 1 majuscule, 1 chiffre"
                autoComplete="new-password"
                required
              />
            )
          }}
        </form.Field>
        <form.Field name="acceptTerms">
          {(field) => {
            return (
              <FormCheckboxField
                field={field}
                required
                label={
                  <>
                    J&apos;ai lu et j&apos;accepte les{' '}
                    <Link
                      to="/cgv"
                      className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                    >
                      conditions générales de vente
                    </Link>{' '}
                    et la{' '}
                    <Link
                      to="/politique-confidentialite"
                      className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                    >
                      politique de confidentialité
                    </Link>
                  </>
                }
              />
            )
          }}
        </form.Field>
        {signUpMutation.error ? (
          <FormErrorAlert
            message={getAuthErrorMessage(signUpMutation.error.message)}
          />
        ) : null}
        <LoadingButton
          type="submit"
          size="lg"
          className="w-full"
          isLoading={signUpMutation.isPending}
          loadingText="Création du compte..."
        >
          Créer mon compte
          <ArrowRight className="size-4" aria-hidden="true" />
        </LoadingButton>
      </form>
    </div>
  )
}

export const Route = createFileRoute('/_auth/inscription')({
  component: InscriptionPage,
  head: () => {
    const seoData = seo({
      title: 'Créer un compte',
      description:
        'Créez votre compte Pasio Padel Club et réservez vos créneaux de padel à Bayonne. 7 terrains disponibles, réservation simplifiée.',
      pathname: '/inscription'
    })

    return {
      meta: [{ name: 'robots', content: 'noindex,nofollow' }, ...seoData.meta],
      links: seoData.links
    }
  }
})
