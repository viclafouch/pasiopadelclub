import React from 'react'
import { KeyIcon, PencilIcon } from 'lucide-react'
import { AnimatedNotification } from '@/components/animated-notification'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '~/convex/_generated/api'
import { useClerk } from '@clerk/tanstack-react-start'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { DataExportSection } from './data-export-section'
import { DeleteAccountSection } from './delete-account-section'
import { EditProfileModal } from './edit-profile-modal'

export const ProfileTabSkeleton = (): React.ReactNode => {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6 space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
      </div>
      <div className="rounded-lg border p-6 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="rounded-lg border p-6 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="rounded-lg border border-destructive/50 p-6 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
    </div>
  )
}

export const ProfileTab = () => {
  const { openUserProfile } = useClerk()
  const currentUserQuery = useSuspenseQuery(
    convexQuery(api.users.getCurrent, {})
  )
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)

  const user = currentUserQuery.data

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Utilisateur non trouvé</p>
      </div>
    )
  }

  const handleEditSuccess = () => {
    setShowSuccess(true)
    setTimeout(() => {
      return setShowSuccess(false)
    }, 3000)
  }

  return (
    <>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => {
          return setIsEditModalOpen(false)
        }}
        onSuccess={handleEditSuccess}
        defaultValues={{
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
        }}
      />
      <AnimatedNotification show={showSuccess} variant="success" withSpacing>
        Vos informations ont été mises à jour.
      </AnimatedNotification>
      <div className="space-y-6">
        <div className="rounded-lg border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Informations personnelles</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                return setIsEditModalOpen(true)
              }}
            >
              <PencilIcon className="size-4" aria-hidden="true" />
              Modifier
            </Button>
          </div>
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
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-medium">{user.phone ?? 'Non renseigné'}</p>
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
    </>
  )
}
