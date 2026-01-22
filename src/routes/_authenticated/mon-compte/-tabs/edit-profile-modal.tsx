import { FormErrorAlert, FormField } from '@/components/form-field'
import { LoadingButton } from '@/components/loading-button'
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
import { profileFormSchema } from '@/constants/schemas'
import { getErrorMessage } from '@/helpers/error'
import { updateProfileFn } from '@/server/users'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

type EditProfileModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  defaultValues: {
    email: string
    firstName: string
    lastName: string
    phone: string | null
  }
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  onSuccess,
  defaultValues
}: EditProfileModalProps) => {
  const router = useRouter()

  const updateProfileMutation = useMutation({
    mutationFn: (values: {
      firstName: string
      lastName: string
      phone: string
    }) => {
      return updateProfileFn({ data: values })
    },
    onSuccess: async () => {
      await router.invalidate()
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
          <DialogTitle>Modifier le profil</DialogTitle>
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
          <div className="grid gap-4 xs:grid-cols-2">
            <form.Field name="firstName">
              {(field) => {
                return (
                  <FormField
                    field={field}
                    label="Prénom"
                    placeholder="Prénom"
                    autoComplete="given-name"
                    required
                  />
                )
              }}
            </form.Field>
            <form.Field name="lastName">
              {(field) => {
                return (
                  <FormField
                    field={field}
                    label="Nom"
                    placeholder="Nom"
                    autoComplete="family-name"
                    required
                  />
                )
              }}
            </form.Field>
          </div>
          <form.Field name="phone">
            {(field) => {
              return (
                <FormField
                  field={field}
                  label="Téléphone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                />
              )
            }}
          </form.Field>
          {updateProfileMutation.error ? (
            <FormErrorAlert
              message={getErrorMessage(updateProfileMutation.error)}
            />
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
            <LoadingButton
              type="submit"
              isLoading={updateProfileMutation.isPending}
              loadingText="Enregistrement..."
            >
              Enregistrer
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
