import React from 'react'
import { PencilIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { phoneFormSchema } from '@/constants/validation'
import { getErrorMessage } from '@/helpers/error'
import { api } from '~/convex/_generated/api'
import { useConvexMutation } from '@convex-dev/react-query'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'

type PhoneFieldProps = {
  initialPhone: string | null
  onSuccess: () => void
}

export const PhoneField = ({ initialPhone, onSuccess }: PhoneFieldProps) => {
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
      onSubmit: phoneFormSchema
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
