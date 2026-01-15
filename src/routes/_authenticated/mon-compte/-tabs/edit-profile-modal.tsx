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
import { getAuthUserQueryOpts } from '@/constants/queries'
import { profileFormSchema } from '@/constants/validation'
import { getErrorMessage } from '@/helpers/error'
import { updateProfileFn } from '@/server/users'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()

  const updateProfileMutation = useMutation({
    mutationFn: (values: {
      firstName: string
      lastName: string
      phone: string
    }) => {
      return updateProfileFn({ data: values })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(getAuthUserQueryOpts())
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
          <div className="grid grid-cols-2 gap-4">
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
                      placeholder="Prénom"
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
                      placeholder="Nom"
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
          </div>
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
