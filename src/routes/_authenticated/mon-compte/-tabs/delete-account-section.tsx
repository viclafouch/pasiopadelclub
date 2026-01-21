import React from 'react'
import { CheckIcon, Trash2Icon } from 'lucide-react'
import { FormErrorAlert, FormField } from '@/components/form-field'
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
import { deleteAccountFormSchema } from '@/constants/schemas'
import { getAuthErrorMessage } from '@/helpers/auth-errors'
import { authClient } from '@/lib/auth-client'
import { anonymizeAccountFn } from '@/server/users'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'

const REDIRECT_DELAY_MS = 1500

export const DeleteAccountSection = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)

  const deleteAccountMutation = useMutation({
    mutationFn: async (values: { password: string }) => {
      await anonymizeAccountFn({ data: { password: values.password } })
    },
    onSuccess: async () => {
      setShowSuccess(true)
      await authClient.signOut()
      setTimeout(() => {
        window.location.href = '/'
      }, REDIRECT_DELAY_MS)
    }
  })

  const form = useForm({
    defaultValues: {
      password: ''
    },
    validators: {
      onSubmit: deleteAccountFormSchema
    },
    onSubmit: ({ value }) => {
      deleteAccountMutation.mutate({ password: value.password })
    }
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
      deleteAccountMutation.reset()
    }

    setIsOpen(open)
  }

  return (
    <div className="rounded-lg border border-destructive/50 p-6">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <div>
          <h3 className="text-base font-semibold text-destructive">
            Suppression du compte
          </h3>
          <p className="text-sm text-muted-foreground">
            Supprimez définitivement votre compte. Vos données personnelles
            seront effacées, l&apos;historique sera conservé anonymement.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full shrink-0 xs:w-auto">
              <Trash2Icon className="size-4" aria-hidden="true" />
              Supprimer
            </Button>
          </DialogTrigger>
          <DialogContent>
            {showSuccess ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckIcon
                    className="size-8 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-lg font-semibold">
                    Compte supprimé
                  </h3>
                  <p className="text-muted-foreground">
                    Votre compte a été supprimé. Redirection...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Supprimer le compte</DialogTitle>
                  <DialogDescription>
                    Cette action est irréversible. Votre compte sera
                    définitivement supprimé et vous serez déconnecté. Votre
                    historique de réservations sera conservé de manière anonyme
                    pour nos statistiques.
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
                  <form.Field name="password">
                    {(field) => {
                      return (
                        <FormField
                          field={field}
                          label="Mot de passe actuel"
                          type="password"
                          autoComplete="off"
                          required
                        />
                      )
                    }}
                  </form.Field>
                  {deleteAccountMutation.error ? (
                    <FormErrorAlert
                      message={getAuthErrorMessage(
                        deleteAccountMutation.error.message
                      )}
                    />
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
                      variant="destructive"
                      isLoading={deleteAccountMutation.isPending}
                      loadingText="Suppression..."
                    >
                      Supprimer définitivement
                    </LoadingButton>
                  </DialogFooter>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
