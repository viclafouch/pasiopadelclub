import React from 'react'
import { DownloadIcon, KeyIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { z } from 'zod/v3'
import { AnimatedNotification } from '@/components/animated-notification'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { downloadJson } from '@/helpers/download'
import { getErrorMessage } from '@/helpers/error'
import { api } from '~/convex/_generated/api'
import { useClerk } from '@clerk/tanstack-react-start'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useForm } from '@tanstack/react-form'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

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
  const [isEditing, setIsEditing] = React.useState(false)

  const updatePhoneMutation = useMutation({
    mutationFn: useConvexMutation(api.users.updatePhone),
    onSuccess: () => {
      setIsEditing(false)
      onSuccess()
    }
  })

  const handleCancelEdit = () => {
    setIsEditing(false)
    updatePhoneMutation.reset()
  }

  const form = useForm({
    defaultValues: {
      phone: initialPhone ?? ''
    },
    validators: {
      onSubmit: phoneSchema
    },
    onSubmit: ({ value }) => {
      updatePhoneMutation.mutate({ phone: value.phone })
    }
  })

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
      <div className="flex gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={updatePhoneMutation.isPending}
          aria-busy={updatePhoneMutation.isPending}
        >
          {updatePhoneMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleCancelEdit}
          disabled={updatePhoneMutation.isPending}
        >
          Annuler
        </Button>
      </div>
      {updatePhoneMutation.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {getErrorMessage(updatePhoneMutation.error)}
        </p>
      ) : null}
    </form>
  )
}

const DataExportSection = () => {
  const exportMutation = useMutation({
    mutationFn: useConvexMutation(api.users.exportMyData),
    onSuccess: (data) => {
      const filename = `pasio-padel-data-${new Date().toISOString().split('T')[0]}.json`
      downloadJson(data, filename)
    }
  })

  return (
    <div className="rounded-lg border p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">Mes données (RGPD)</h3>
          <p className="text-sm text-muted-foreground">
            Téléchargez une copie de vos données personnelles au format JSON.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            return exportMutation.mutate({})
          }}
          disabled={exportMutation.isPending}
          aria-busy={exportMutation.isPending}
          className="shrink-0"
        >
          <DownloadIcon className="size-4" aria-hidden="true" />
          {exportMutation.isPending ? 'Préparation...' : 'Exporter mes données'}
        </Button>
      </div>
      {exportMutation.isError ? (
        <p role="alert" className="text-sm text-destructive mt-4">
          {getErrorMessage(exportMutation.error)}
        </p>
      ) : null}
    </div>
  )
}

const DeleteAccountSection = () => {
  const { signOut } = useClerk()
  const navigate = useNavigate()

  const deleteAccountMutation = useMutation({
    mutationFn: useConvexMutation(api.users.anonymize),
    onSuccess: async () => {
      await signOut()
      navigate({ to: '/' })
    }
  })

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate({})
  }

  return (
    <div className="rounded-lg border border-destructive/50 p-6 flex items-center justify-between gap-4">
      <div>
        <h3 className="font-semibold text-destructive">Supprimer mon compte</h3>
        <p className="text-sm text-muted-foreground">
          Action irréversible. Données personnelles supprimées, historique
          conservé anonymement.
        </p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="shrink-0">
            <Trash2Icon className="size-4" aria-hidden="true" />
            Supprimer
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer votre compte ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Votre compte sera définitivement
              supprimé et vous serez déconnecté. Votre historique de
              réservations sera conservé de manière anonyme pour nos
              statistiques.
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
        </AlertDialogContent>
      </AlertDialog>
    </div>
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
    <div className="space-y-6">
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
      <div className="rounded-lg border p-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">Sécurité</h3>
          <p className="text-sm text-muted-foreground">
            Gérez votre mot de passe et vos paramètres de sécurité.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            return openUserProfile()
          }}
          className="shrink-0"
        >
          <KeyIcon className="size-4" aria-hidden="true" />
          Gérer la sécurité
        </Button>
      </div>
      <DataExportSection />
      <DeleteAccountSection />
    </div>
  )
}
