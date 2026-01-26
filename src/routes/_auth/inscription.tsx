import React from 'react'
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  HomeIcon,
  MailIcon,
  RefreshCwIcon
} from 'lucide-react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { z } from 'zod'
import {
  FormCheckboxField,
  FormErrorAlert,
  FormField
} from '@/components/form-field'
import { LoadingButton } from '@/components/loading-button'
import { SuccessCheckmark } from '@/components/success-checkmark'
import { Button } from '@/components/ui/button'
import { getAuthUserQueryOpts } from '@/constants/queries'
import {
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  strongPasswordSchema
} from '@/constants/schemas'
import { getAuthErrorMessage } from '@/helpers/auth-errors'
import { useResendVerificationEmail } from '@/hooks/use-resend-verification-email'
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
  }, 'Vous devez accepter les conditions pour créer un compte'),
  acceptDataProcessing: z.boolean().refine((accepted) => {
    return accepted
  }, 'Vous devez consentir au traitement de vos données')
})

const BENEFITS = [
  'Réservation express',
  'Gestion en ligne',
  'Historique des parties',
  'Paiement sécurisé'
] as const

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2
    }
  }
} as const satisfies Variants

const ITEM_VARIANTS = {
  hidden: { opacity: 0, translateY: 16 },
  visible: {
    opacity: 1,
    translateY: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12
    }
  }
} as const satisfies Variants

type SuccessStateProps = {
  successRef: React.RefObject<HTMLDivElement | null>
  email: string
}

const SuccessState = ({ successRef, email }: SuccessStateProps) => {
  const shouldReduceMotion = useReducedMotion()
  const { mutation, cooldown } = useResendVerificationEmail({ email })

  return (
    <motion.div
      ref={successRef}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      variants={shouldReduceMotion ? undefined : CONTAINER_VARIANTS}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      animate="visible"
      className="flex flex-col items-center py-10 text-center outline-none"
    >
      <motion.div
        variants={shouldReduceMotion ? undefined : ITEM_VARIANTS}
        className="mb-6"
      >
        <SuccessCheckmark shouldReduceMotion={shouldReduceMotion} />
      </motion.div>
      <motion.h2
        variants={shouldReduceMotion ? undefined : ITEM_VARIANTS}
        className="mb-2 font-display text-xl font-semibold text-foreground"
      >
        Compte créé avec succès !
      </motion.h2>
      <motion.div
        variants={shouldReduceMotion ? undefined : ITEM_VARIANTS}
        className="space-y-3"
      >
        <p className="text-muted-foreground">
          Un email de confirmation a été envoyé à
        </p>
        <p className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 font-medium text-foreground">
          <MailIcon className="size-4 text-primary" aria-hidden="true" />
          {email}
        </p>
        <p className="text-sm text-muted-foreground">
          Pensez à vérifier votre boîte mail pour confirmer votre adresse.
        </p>
      </motion.div>
      <motion.div
        variants={shouldReduceMotion ? undefined : ITEM_VARIANTS}
        className="mt-6 flex flex-col items-center gap-2"
      >
        <LoadingButton
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            mutation.mutate()
          }}
          // Exception: disabled pendant le cooldown pour éviter le spam email
          disabled={cooldown.isActive}
          isLoading={mutation.isPending}
        >
          <RefreshCwIcon className="size-4" aria-hidden="true" />
          {cooldown.isActive ? (
            <>
              Renvoyer dans{' '}
              <span className="tabular-nums">{cooldown.remainingSeconds}s</span>
            </>
          ) : (
            "Renvoyer l'email"
          )}
        </LoadingButton>
        {mutation.isSuccess && cooldown.isActive ? (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <CheckIcon className="size-4" aria-hidden="true" />
            Email envoyé avec succès
          </span>
        ) : null}
      </motion.div>
      <motion.div
        variants={shouldReduceMotion ? undefined : ITEM_VARIANTS}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <Button variant="outline" asChild>
          <Link to="/">
            <HomeIcon className="size-4" aria-hidden="true" />
            Retour à l&apos;accueil
          </Link>
        </Button>
        <Button asChild>
          <Link to="/reservation">
            <CalendarIcon className="size-4" aria-hidden="true" />
            Réserver un terrain
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  )
}

const InscriptionPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const successRef = React.useRef<HTMLDivElement>(null)

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

      const { data: session } = await authClient.getSession()

      return { hasSession: session !== null }
    },
    onSuccess: async ({ hasSession }) => {
      if (hasSession) {
        await queryClient.invalidateQueries(getAuthUserQueryOpts())
        await router.invalidate({ sync: true })
        router.navigate({ to: '/' })
      } else {
        setTimeout(() => {
          successRef.current?.focus()
        }, 0)
      }
    }
  })

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      acceptTerms: false,
      acceptDataProcessing: false
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

  const showEmailVerificationPrompt =
    signUpMutation.isSuccess &&
    signUpMutation.variables &&
    signUpMutation.data &&
    !signUpMutation.data.hasSession

  if (showEmailVerificationPrompt) {
    return (
      <SuccessState
        successRef={successRef}
        email={signUpMutation.variables.email}
      />
    )
  }

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
                <CheckIcon
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
        <div className="space-y-4">
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
          <form.Field name="acceptDataProcessing">
            {(field) => {
              return (
                <FormCheckboxField
                  field={field}
                  required
                  label={
                    <>
                      Je consens au traitement de mes données personnelles tel
                      que décrit dans la{' '}
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
        </div>
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
          <ArrowRightIcon className="size-4" aria-hidden="true" />
        </LoadingButton>
        <p className="text-xs text-muted-foreground/80">
          Pour des raisons de sécurité, nous collectons votre adresse IP et des
          informations techniques (navigateur, système) lors de votre
          inscription et connexion.
        </p>
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
