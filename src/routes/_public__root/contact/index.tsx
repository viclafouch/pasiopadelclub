import React from 'react'
import { flushSync } from 'react-dom'
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import {
  FormErrorAlert,
  FormField,
  FormTextareaField
} from '@/components/form-field'
import { LoadingButton } from '@/components/loading-button'
import { PageHeader } from '@/components/page-header'
import { SuccessCheckmark } from '@/components/success-checkmark'
import { Button } from '@/components/ui/button'
import { CLUB_INFO } from '@/constants/app'
import { contactFormSchema } from '@/constants/schemas'
import { getErrorMessage } from '@/helpers/error'
import { submitContactFormFn } from '@/server/contact'
import { seo } from '@/utils/seo'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'

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
  onReset: () => void
}

const SuccessState = ({ successRef, onReset }: SuccessStateProps) => {
  const shouldReduceMotion = useReducedMotion()

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
      <motion.h3
        variants={shouldReduceMotion ? undefined : ITEM_VARIANTS}
        className="mb-2 font-display text-xl font-semibold text-foreground"
      >
        Message envoyé !
      </motion.h3>
      <motion.p
        variants={shouldReduceMotion ? undefined : ITEM_VARIANTS}
        className="text-muted-foreground"
      >
        Nous vous répondrons dans les plus brefs délais.
      </motion.p>
      <motion.div variants={shouldReduceMotion ? undefined : ITEM_VARIANTS}>
        <Button className="mt-6" variant="outline" onClick={onReset}>
          Envoyer un autre message
        </Button>
      </motion.div>
    </motion.div>
  )
}

const ContactPage = () => {
  const { user } = useRouteContext({ from: '/_public__root' })
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const successRef = React.useRef<HTMLDivElement>(null)

  const submitMutation = useMutation({
    mutationFn: submitContactFormFn,
    onSuccess: () => {
      flushSync(() => {
        setIsSubmitted(true)
      })
      successRef.current?.focus()
    }
  })

  const defaultName = user ? `${user.firstName} ${user.lastName}` : ''
  const defaultEmail = user?.email ?? ''

  const form = useForm({
    defaultValues: {
      name: defaultName,
      email: defaultEmail,
      subject: '',
      message: ''
    },
    validators: {
      onSubmit: contactFormSchema
    },
    onSubmit: async ({ value }) => {
      await submitMutation.mutateAsync({ data: value })
    }
  })

  const resetForm = () => {
    setIsSubmitted(false)
    submitMutation.reset()
    form.reset()
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="section-py relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="container relative">
          <PageHeader
            title="Contactez-nous"
            description="Une question sur nos terrains ou nos services ? Notre équipe vous répond sous 24h."
          />
        </div>
      </section>
      <section className="section-pb">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="order-1 lg:order-1">
              <div className="rounded-2xl border bg-card p-8 shadow-sm">
                {isSubmitted ? (
                  <SuccessState successRef={successRef} onReset={resetForm} />
                ) : (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      form.handleSubmit()
                    }}
                    className="space-y-5"
                    noValidate
                  >
                    <form.Field name="name">
                      {(field) => {
                        return (
                          <FormField
                            field={field}
                            label="Nom complet"
                            placeholder="Jean Dupont"
                            autoComplete="name"
                            required
                          />
                        )
                      }}
                    </form.Field>
                    <form.Field name="email">
                      {(field) => {
                        return (
                          <FormField
                            field={field}
                            label="Adresse email"
                            type="email"
                            placeholder="jean@exemple.fr"
                            autoComplete="email"
                            required
                          />
                        )
                      }}
                    </form.Field>
                    <form.Field name="subject">
                      {(field) => {
                        return (
                          <FormField
                            field={field}
                            label="Objet"
                            placeholder="Demande de renseignements"
                            required
                          />
                        )
                      }}
                    </form.Field>
                    <form.Field name="message">
                      {(field) => {
                        return (
                          <FormTextareaField
                            field={field}
                            label="Message"
                            placeholder="Votre message..."
                            required
                            className="min-h-40 field-sizing-fixed"
                          />
                        )
                      }}
                    </form.Field>
                    {submitMutation.error ? (
                      <FormErrorAlert
                        message={getErrorMessage(submitMutation.error)}
                      />
                    ) : null}
                    <LoadingButton
                      type="submit"
                      size="lg"
                      className="w-full"
                      isLoading={submitMutation.isPending}
                      loadingText="Envoi en cours..."
                    >
                      <Send className="size-4" aria-hidden="true" />
                      Envoyer le message
                    </LoadingButton>
                  </form>
                )}
              </div>
            </div>
            <div className="order-2 lg:order-2">
              <div className="grid gap-8 md:grid-cols-1">
                <div className="md:col-span-2">
                  <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
                    Informations
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin
                          className="h-5 w-5 text-primary"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Adresse</p>
                        <p className="text-muted-foreground">
                          {CLUB_INFO.address.street},{' '}
                          {CLUB_INFO.address.postalCode}{' '}
                          {CLUB_INFO.address.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Phone
                          className="h-5 w-5 text-primary"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Téléphone</p>
                        <a
                          href={CLUB_INFO.phone.href}
                          className="text-muted-foreground transition-colors hover:text-primary"
                        >
                          {CLUB_INFO.phone.display}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Mail
                          className="h-5 w-5 text-primary"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <a
                          href={`mailto:${CLUB_INFO.email}`}
                          className="text-muted-foreground transition-colors hover:text-primary"
                        >
                          {CLUB_INFO.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Clock
                          className="h-5 w-5 text-primary"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Horaires</p>
                        <p className="text-muted-foreground">
                          {CLUB_INFO.hours.days} de {CLUB_INFO.hours.open}00
                          {' à '}
                          {CLUB_INFO.hours.close}00
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-border/50 md:col-span-3 md:h-full md:min-h-[300px]">
                  <iframe
                    src={CLUB_INFO.address.googleMapsUrl}
                    width="100%"
                    height="100%"
                    style={{ minHeight: '300px' }}
                    allowFullScreen
                    title={`${CLUB_INFO.name} - Localisation`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="border-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export const Route = createFileRoute('/_public__root/contact/')({
  component: ContactPage,
  head: () => {
    return {
      ...seo({
        title: 'Contact',
        description: `Contactez ${CLUB_INFO.name} à ${CLUB_INFO.address.city}. Adresse : ${CLUB_INFO.address.full}. Téléphone : ${CLUB_INFO.phone.display}. Ouvert 7j/7 de ${CLUB_INFO.hours.open} à ${CLUB_INFO.hours.close}.`,
        pathname: '/contact'
      })
    }
  }
})
