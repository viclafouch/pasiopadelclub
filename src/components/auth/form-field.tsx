import React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export type FieldState = {
  state: { value: string; meta: { errors: unknown[] } }
  handleBlur: () => void
  handleChange: (value: string) => void
}

type FormFieldProps = Pick<
  React.ComponentProps<'input'>,
  'name' | 'type' | 'placeholder' | 'autoComplete' | 'maxLength' | 'inputMode'
> & {
  label: string
  field: FieldState
  showPasswordToggle?: boolean
  isPasswordVisible?: boolean
  onTogglePassword?: () => void
  formatError?: (error: unknown) => string
}

const defaultFormatError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return 'Erreur de validation'
}

export const FormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  autoComplete,
  maxLength,
  inputMode,
  field,
  showPasswordToggle,
  isPasswordVisible,
  onTogglePassword,
  formatError = defaultFormatError
}: FormFieldProps) => {
  const hasError = field.state.meta.errors.length > 0
  const errorId = `${name}-error`

  const getInputType = (): React.ComponentProps<'input'>['type'] => {
    if (!showPasswordToggle) {
      return type
    }

    return isPasswordVisible ? 'text' : 'password'
  }

  const inputType = getInputType()

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <Input
          type={inputType}
          id={name}
          name={name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(event) => {
            return field.handleChange(event.target.value)
          }}
          autoComplete={autoComplete}
          maxLength={maxLength}
          inputMode={inputMode}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={cn('h-11', showPasswordToggle ? 'pr-12' : undefined)}
          placeholder={placeholder}
        />
        {showPasswordToggle ? (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={
              isPasswordVisible
                ? 'Masquer le mot de passe'
                : 'Afficher le mot de passe'
            }
          >
            {isPasswordVisible ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>
      {hasError ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {formatError(field.state.meta.errors[0])}
        </p>
      ) : null}
    </div>
  )
}
