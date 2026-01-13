import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { profileFormSchema } from '@/constants/validation'
import { getErrorMessage } from '@/helpers/error'
import { api } from '~/convex/_generated/api'
import { useUser } from '@clerk/tanstack-react-start'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type EditProfileModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  defaultValues: {
    email: string
    firstName: string | null
    lastName: string | null
    phone: string | null
  }
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  onSuccess,
  defaultValues
}: EditProfileModalProps) => {
  const { user: clerkUser } = useUser()
  const queryClient = useQueryClient()

  const updatePhoneMutation = useMutation({
    mutationFn: useConvexMutation(api.users.updatePhone)
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (values: {
      firstName: string
      lastName: string
      phone: string
    }) => {
      const updates: Promise<unknown>[] = []
      let clerkUpdated = false

      const firstNameChanged =
        values.firstName !== (defaultValues.firstName ?? '')
      const lastNameChanged = values.lastName !== (defaultValues.lastName ?? '')

      if (clerkUser && (firstNameChanged || lastNameChanged)) {
        updates.push(
          clerkUser.update({
            firstName: values.firstName,
            lastName: values.lastName
          })
        )
        clerkUpdated = true
      }

      const phoneChanged = values.phone !== (defaultValues.phone ?? '')

      if (phoneChanged && values.phone.trim() !== '') {
        updates.push(updatePhoneMutation.mutateAsync({ phone: values.phone }))
      }

      await Promise.all(updates)

      return { clerkUpdated }
    },
    onSuccess: async (data) => {
      if (data.clerkUpdated) {
        const { queryKey } = convexQuery(api.users.getCurrent, {})
        await queryClient.invalidateQueries({ queryKey })
      }

      onSuccess()
      onClose()
    }
  })

  const form = useForm({
    defaultValues: {
      firstName: defaultValues.firstName ?? '',
      lastName: defaultValues.lastName ?? '',
      phone: defaultValues.phone ?? ''
    },
    validators: {
      onSubmit: profileFormSchema
    },
    onSubmit: ({ value }) => {
      updateProfileMutation.mutate(value)
    }
  })

  const handleClose = () => {
    form.reset()
    updateProfileMutation.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier mon profil</DialogTitle>
          <DialogDescription>
            Modifiez vos informations personnelles ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={defaultValues.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              L&apos;email ne peut pas être modifié ici.
            </p>
          </div>
          <form.Field name="firstName">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0
              const errorId = `${field.name}-error`

              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Prénom</Label>
                  <Input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      return field.handleChange(event.target.value)
                    }}
                    autoComplete="given-name"
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                    placeholder="Votre prénom"
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
          <form.Field name="lastName">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0
              const errorId = `${field.name}-error`

              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Nom</Label>
                  <Input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      return field.handleChange(event.target.value)
                    }}
                    autoComplete="family-name"
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                    placeholder="Votre nom"
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
          <form.Field name="phone">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0
              const errorId = `${field.name}-error`

              return (
                <div className="space-y-2">
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
          {updateProfileMutation.isError ? (
            <p role="alert" className="text-sm text-destructive">
              {getErrorMessage(updateProfileMutation.error)}
            </p>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateProfileMutation.isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              aria-busy={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending
                ? 'Enregistrement...'
                : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
