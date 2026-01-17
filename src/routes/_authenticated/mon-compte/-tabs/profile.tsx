import React from 'react'
import { PencilIcon } from 'lucide-react'
import { AnimatedNotification } from '@/components/animated-notification'
import {
  CreditBalanceSection,
  CreditBalanceSectionSkeleton
} from '@/components/credit-balance-section'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { CurrentUser } from '@/server/auth'
import { DataExportSection } from './data-export-section'
import { DeleteAccountSection } from './delete-account-section'
import { EditProfileModal } from './edit-profile-modal'

export const ProfileTabSkeleton = () => {
  return (
    <div className="space-y-6">
      <CreditBalanceSectionSkeleton />
      <div className="space-y-4 rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-24" />
        </div>
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
      <div className="flex items-center justify-between gap-4 rounded-lg border p-6">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="flex items-center justify-between gap-4 rounded-lg border p-6">
        <div className="space-y-1">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
    </div>
  )
}

type ProfileTabProps = {
  user: CurrentUser
}

export const ProfileTab = ({ user }: ProfileTabProps) => {
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)

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
        <React.Suspense fallback={<CreditBalanceSectionSkeleton />}>
          <CreditBalanceSection />
        </React.Suspense>
        <div className="space-y-4 rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-xl font-bold">
              Informations personnelles
            </h3>
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
              <p className="font-medium">{user.firstName || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nom</p>
              <p className="font-medium">{user.lastName || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-medium">{user.phone ?? 'Non renseigné'}</p>
            </div>
          </div>
        </div>
        <DataExportSection />
        <DeleteAccountSection />
      </div>
    </>
  )
}
