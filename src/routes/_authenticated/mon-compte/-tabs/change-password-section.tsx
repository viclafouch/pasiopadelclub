import React from 'react'
import { KeyIcon } from 'lucide-react'
import { AnimatedNotification } from '@/components/animated-notification'
import { FormField } from '@/components/form-field'
import { LoadingButton } from '@/components/loading-button'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { changePasswordFormSchema } from '@/constants/schemas'
import { getChangePasswordErrorMessage } from '@/helpers/auth-errors'
import { changePassword } from '@/lib/auth-client'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'

const SUCCESS_NOTIFICATION_DURATION_MS = 3000

export const ChangePasswordSection = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)

  const changePasswordMutation = useMutation({
    mutationFn: async (values: {
      currentPassword: string
      newPassword: string
    }) => {
      const result = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true
      })

      if (result.error) {
        throw new Error(result.error.code ?? result.error.message)
      }
    },
    onSuccess: () => {
      setIsOpen(false)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, SUCCESS_NOTIFICATION_DURATION_MS)
    }
  })

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validators: {
      onSubmit: changePasswordFormSchema
    },
    onSubmit: ({ value }) => {
      changePasswordMutation.mutate({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword
      })
    }
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
      changePasswordMutation.reset()
    }

    setIsOpen(open)
  }

  return (
    <>
      <AnimatedNotification show={showSuccess} variant="success" withSpacing>
        Votre mot de passe a été modifié. Vos autres sessions ont été
        déconnectées par sécurité.
      </AnimatedNotification>
      <div className="rounded-lg border p-6">
        <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
          <div>
            <h3 className="font-sans text-xl font-bold">Mot de passe</h3>
            <p className="text-sm text-muted-foreground">
              Modifiez votre mot de passe de connexion.
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full shrink-0 xs:w-auto">
                <KeyIcon className="size-4" aria-hidden="true" />
                Modifier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier mon mot de passe</DialogTitle>
                <DialogDescription>
                  Entrez votre mot de passe actuel puis choisissez un nouveau
                  mot de passe.
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
                <form.Field name="currentPassword">
                  {(field) => {
                    return (
                      <FormField
                        field={field}
                        label="Mot de passe actuel"
                        type="password"
                        autoComplete="current-password"
                        required
                      />
                    )
                  }}
                </form.Field>
                <form.Field name="newPassword">
                  {(field) => {
                    return (
                      <FormField
                        field={field}
                        label="Nouveau mot de passe"
                        type="password"
                        autoComplete="new-password"
                        required
                      />
                    )
                  }}
                </form.Field>
                <form.Field name="confirmPassword">
                  {(field) => {
                    return (
                      <FormField
                        field={field}
                        label="Confirmer le mot de passe"
                        type="password"
                        autoComplete="new-password"
                        required
                      />
                    )
                  }}
                </form.Field>
                <p className="text-xs text-muted-foreground">
                  Le mot de passe doit contenir au moins 8 caractères, une
                  majuscule, une minuscule et un chiffre.
                </p>
                {changePasswordMutation.isError ? (
                  <p role="alert" className="text-sm text-destructive">
                    {getChangePasswordErrorMessage(
                      changePasswordMutation.error.message
                    )}
                  </p>
                ) : null}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      return handleOpenChange(false)
                    }}
                  >
                    Annuler
                  </Button>
                  <LoadingButton
                    type="submit"
                    isLoading={changePasswordMutation.isPending}
                    loadingText="Modification..."
                  >
                    Modifier
                  </LoadingButton>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}
