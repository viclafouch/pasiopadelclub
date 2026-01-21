import React from 'react'
import { CheckIcon, Trash2Icon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/helpers/error'
import { authClient } from '@/lib/auth-client'
import { anonymizeAccountFn } from '@/server/users'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

const REDIRECT_DELAY_MS = 1500

export const DeleteAccountSection = () => {
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = React.useState(false)

  const deleteAccountMutation = useMutation({
    mutationFn: () => {
      return anonymizeAccountFn()
    },
    onSuccess: async () => {
      setShowSuccess(true)
      await authClient.signOut()
      setTimeout(() => {
        navigate({ to: '/' })
      }, REDIRECT_DELAY_MS)
    }
  })

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate()
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full shrink-0 xs:w-auto">
              <Trash2Icon className="size-4" aria-hidden="true" />
              Supprimer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
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
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer le compte</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Votre compte sera
                    définitivement supprimé et vous serez déconnecté. Votre
                    historique de réservations sera conservé de manière anonyme
                    pour nos statistiques.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {deleteAccountMutation.isError ? (
                  <p role="alert" className="text-sm text-destructive">
                    {getErrorMessage(deleteAccountMutation.error)}
                  </p>
                ) : null}
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleteAccountMutation.isPending}>
                    Annuler
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deleteAccountMutation.isPending}
                    aria-busy={deleteAccountMutation.isPending}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    {deleteAccountMutation.isPending
                      ? 'Suppression...'
                      : 'Supprimer définitivement'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </>
            )}
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
