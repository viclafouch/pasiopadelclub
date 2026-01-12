import React from 'react'
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { z } from 'zod/v3'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { seo } from '@/utils/seo'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'

const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Veuillez entrer une adresse email valide'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères')
})

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return 'Erreur de validation'
}

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
                    <h3 className="mb-2 text-xl font-semibold text-foreground">
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
                          20 rue Alfred de Vigny
                          <br />
                          64600 Anglet
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
                          href="tel:+33971117928"
                          className="text-muted-foreground transition-colors hover:text-primary"
                        >
                          09 71 11 79 28
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
                          href="mailto:contact@pasiopadelclub.fr"
                          className="text-muted-foreground transition-colors hover:text-primary"
                        >
                          contact@pasiopadelclub.fr
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
                          Tous les jours
                          <br />
                          <span className="font-medium text-primary">
                            8h00 — 22h00
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-border/50">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2894.5400183835977!2d-1.496321923788685!3d43.49106897111039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd514182cba36089%3A0xe20604785805f73!2sPASIO%20PADEL%20CLUB!5e0!3m2!1sfr!2sfr!4v1767301750127!5m2!1sfr!2sfr"
                    width="100%"
                    height="300"
                    allowFullScreen
                    title="Pasio Padel Club - Localisation"
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
        description:
          'Contactez Pasio Padel Club à Anglet. Adresse : 20 rue Alfred de Vigny, 64600 Anglet. Téléphone : 09 71 11 79 28. Ouvert 7j/7 de 8h à 22h.',
        pathname: '/contact'
      })
    }
  }
})
