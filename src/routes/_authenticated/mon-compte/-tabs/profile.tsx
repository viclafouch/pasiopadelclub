import React from 'react'
import { useMutation } from 'convex/react'
import { KeyIcon, PencilIcon } from 'lucide-react'
import { z } from 'zod/v3'
import { AnimatedNotification } from '@/components/animated-notification'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getErrorMessage } from '@/helpers/error'
import { api } from '~/convex/_generated/api'
import { useClerk } from '@clerk/tanstack-react-start'
import { convexQuery } from '@convex-dev/react-query'
import { useForm } from '@tanstack/react-form'
import { useSuspenseQuery } from '@tanstack/react-query'

const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, 'Le numéro doit contenir au moins 10 chiffres')
    .regex(/^[0-9+\s-]+$/, 'Format de téléphone invalide')
})

type PhoneFieldProps = {
  initialPhone: string | null
  onSuccess: () => void
}

const PhoneField = ({ initialPhone, onSuccess }: PhoneFieldProps) => {
  const updatePhone = useMutation(api.users.updatePhone)
  const [isEditing, setIsEditing] = React.useState(false)

  const form = useForm({
    defaultValues: {
      phone: initialPhone ?? ''
    },
    validators: {
      onSubmit: phoneSchema
    },
    onSubmit: async ({ value }) => {
      await updatePhone({ phone: value.phone })
      setIsEditing(false)
      onSuccess()
    }
  })

  const handleCancelEdit = () => {
    setIsEditing(false)
    form.reset()
  }

  if (!isEditing) {
    return (
      <>
        <p className="text-sm text-muted-foreground">Téléphone</p>
        <div className="flex items-center gap-2">
          <p className="font-medium">{initialPhone ?? 'Non renseigné'}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              return setIsEditing(true)
            }}
            className="h-6 px-2"
          >
            <PencilIcon className="size-3" aria-hidden="true" />
            <span className="sr-only">Modifier le téléphone</span>
          </Button>
        </div>
      </>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-2"
      noValidate
    >
      <form.Field name="phone">
        {(field) => {
          const hasError = field.state.meta.errors.length > 0
          const errorId = `${field.name}-error`

          return (
            <div className="space-y-1">
              <Label htmlFor={field.name}>Téléphone</Label>
              <Input
                type="tel"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  return field.handleChange(event.target.value)
                }}
                autoComplete="tel"
                aria-invalid={hasError}
                aria-describedby={hasError ? errorId : undefined}
                placeholder="06 12 34 56 78"
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
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
            </div>
          )
        }}
      </form.Subscribe>
    </form>
  )
}

export const ProfileTab = () => {
  const { openUserProfile } = useClerk()
  const currentUserQuery = useSuspenseQuery(
    convexQuery(api.users.getCurrent, {})
  )
  const [showSuccess, setShowSuccess] = React.useState(false)

  const user = currentUserQuery.data

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Utilisateur non trouvé</p>
      </div>
    )
  }

  const handlePhoneSuccess = () => {
    setShowSuccess(true)
    setTimeout(() => {
      return setShowSuccess(false)
    }, 3000)
  }

  return (
    <div>
      <AnimatedNotification show={showSuccess} variant="success">
        Votre numéro de téléphone a été mis à jour.
      </AnimatedNotification>
      <div className="rounded-lg border p-6 space-y-4">
        <h3 className="font-semibold">Informations personnelles</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Prénom</p>
            <p className="font-medium">{user.firstName ?? 'Non renseigné'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nom</p>
            <p className="font-medium">{user.lastName ?? 'Non renseigné'}</p>
          </div>
          <div>
            <PhoneField
              initialPhone={user.phone}
              onSuccess={handlePhoneSuccess}
            />
          </div>
        </div>
      </div>
      <div className="rounded-lg border p-6 space-y-4 mt-6">
        <h3 className="font-semibold">Sécurité</h3>
        <p className="text-sm text-muted-foreground">
          Gérez votre mot de passe et vos paramètres de sécurité.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            return openUserProfile()
          }}
        >
          <KeyIcon className="size-4 mr-2" aria-hidden="true" />
          Gérer la sécurité
        </Button>
      </div>
    </div>
  )
}
