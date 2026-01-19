import React from 'react'
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { z } from 'zod/v3'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CLUB_INFO } from '@/constants/app'
import { getErrorMessage } from '@/helpers/error'
import { seo } from '@/utils/seo'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'

const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Veuillez entrer une adresse email valide'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères')
})

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: ''
    },
    validators: {
      onChange: contactSchema
    },
    onSubmit: async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000)
      })
      setIsSubmitted(true)
    }
  })

  const resetForm = () => {
    setIsSubmitted(false)
    form.reset()
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Contactez-nous
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Une question sur nos terrains ou nos services ? Notre équipe vous
              répond sous 24h.
            </p>
          </div>
        </div>
      </section>
      <section className="pb-20 lg:pb-28">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
                {isSubmitted ? (
                  <div
                    role="status"
                    className="flex flex-col items-center py-12 text-center"
                  >
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2
                        className="h-8 w-8 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                      Message envoyé !
                    </h3>
                    <p className="text-muted-foreground">
                      Nous vous répondrons dans les plus brefs délais.
                    </p>
                    <Button
                      className="mt-6"
                      variant="outline"
                      onClick={resetForm}
                    >
                      Envoyer un autre message
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      form.handleSubmit()
                    }}
                    className="space-y-6"
                    noValidate
                  >
                    <form.Field name="name">
                      {(field) => {
                        const hasError = field.state.meta.errors.length > 0
                        const errorId = `${field.name}-error`

                        return (
                          <div className="space-y-2">
                            <Label htmlFor={field.name}>Nom complet</Label>
                            <Input
                              type="text"
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(event) => {
                                return field.handleChange(event.target.value)
                              }}
                              autoComplete="name"
                              aria-invalid={hasError}
                              aria-describedby={hasError ? errorId : undefined}
                              className="h-11"
                              placeholder="Jean Dupont"
                            />
                            {hasError ? (
                              <p
                                id={errorId}
                                role="alert"
                                className="text-sm text-destructive"
                              >
                                {getErrorMessage(field.state.meta.errors[0])}
                              </p>
                            ) : null}
                          </div>
                        )
                      }}
                    </form.Field>
                    <form.Field name="email">
                      {(field) => {
                        const hasError = field.state.meta.errors.length > 0
                        const errorId = `${field.name}-error`

                        return (
                          <div className="space-y-2">
                            <Label htmlFor={field.name}>Adresse email</Label>
                            <Input
                              type="email"
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(event) => {
                                return field.handleChange(event.target.value)
                              }}
                              autoComplete="email"
                              aria-invalid={hasError}
                              aria-describedby={hasError ? errorId : undefined}
                              className="h-11"
                              placeholder="jean@exemple.fr"
                            />
                            {hasError ? (
                              <p
                                id={errorId}
                                role="alert"
                                className="text-sm text-destructive"
                              >
                                {getErrorMessage(field.state.meta.errors[0])}
                              </p>
                            ) : null}
                          </div>
                        )
                      }}
                    </form.Field>
                    <form.Field name="message">
                      {(field) => {
                        const hasError = field.state.meta.errors.length > 0
                        const errorId = `${field.name}-error`

                        return (
                          <div className="space-y-2">
                            <Label htmlFor={field.name}>Message</Label>
                            <Textarea
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(event) => {
                                return field.handleChange(event.target.value)
                              }}
                              rows={5}
                              aria-invalid={hasError}
                              aria-describedby={hasError ? errorId : undefined}
                              placeholder="Votre message..."
                            />
                            {hasError ? (
                              <p
                                id={errorId}
                                role="alert"
                                className="text-sm text-destructive"
                              >
                                {getErrorMessage(field.state.meta.errors[0])}
                              </p>
                            ) : null}
                          </div>
                        )
                      }}
                    </form.Field>
                    <form.Subscribe
                      selector={(state) => {
                        return state.isSubmitting
                      }}
                    >
                      {(isSubmitting) => {
                        return (
                          <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center gap-2">
                                <span
                                  className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                                  aria-hidden="true"
                                />
                                Envoi en cours...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <Send className="h-4 w-4" aria-hidden="true" />
                                Envoyer le message
                              </span>
                            )}
                          </Button>
                        )
                      }}
                    </form.Subscribe>
                  </form>
                )}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="space-y-8">
                <div>
                  <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
                    Informations
                  </h2>
                  <div className="space-y-5">
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
                          {CLUB_INFO.address.street}
                          <br />
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
                          {CLUB_INFO.hours.days}
                          <br />
                          <span className="font-medium text-primary">
                            {CLUB_INFO.hours.open}00 — {CLUB_INFO.hours.close}00
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-border/50">
                  <iframe
                    src={CLUB_INFO.address.googleMapsUrl}
                    width="100%"
                    height="300"
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
      meta: seo({
        title: 'Contact',
        description: `Contactez ${CLUB_INFO.name} à ${CLUB_INFO.address.city}. Adresse : ${CLUB_INFO.address.full}. Téléphone : ${CLUB_INFO.phone.display}. Ouvert 7j/7 de ${CLUB_INFO.hours.open} à ${CLUB_INFO.hours.close}.`,
        pathname: '/contact'
      })
    }
  }
})
