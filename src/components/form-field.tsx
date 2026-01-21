import { AlertCircle } from 'lucide-react'
import { getErrorMessage } from '@/helpers/error'
import type { AnyFieldApi } from '@tanstack/react-form'
import { Alert, AlertDescription } from './ui/alert'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

type OmittedFieldProps =
  | 'id'
  | 'name'
  | 'value'
  | 'onChange'
  | 'onBlur'
  | 'aria-invalid'
  | 'aria-describedby'

type FormFieldProps = {
  field: AnyFieldApi
  label: string
  required?: boolean
} & Omit<React.ComponentProps<typeof Input>, OmittedFieldProps>

type FormTextareaFieldProps = {
  field: AnyFieldApi
  label: string
  required?: boolean
} & Omit<React.ComponentProps<typeof Textarea>, OmittedFieldProps>

type FormCheckboxFieldProps = {
  field: AnyFieldApi
  label: React.ReactNode
  required?: boolean
}

type FormErrorAlertProps = {
  message: string
}

export const RequiredIndicator = () => {
  return (
    <span aria-hidden="true" className="text-destructive">
      {' '}
      *
    </span>
  )
}

type FieldErrorProps = {
  id: string
  message: string
}

export const FieldError = ({ id, message }: FieldErrorProps) => {
  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  )
}

export const FormErrorAlert = ({ message }: FormErrorAlertProps) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" aria-hidden="true" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

function getFieldAriaProps(field: AnyFieldApi) {
  const hasError = field.state.meta.errors.length > 0

  return {
    'aria-invalid': hasError,
    'aria-describedby': hasError ? `${field.name}-error` : undefined
  }
}

export const FormField = ({
  field,
  label,
  type = 'text',
  required = false,
  ...props
}: FormFieldProps) => {
  const hasError = field.state.meta.errors.length > 0

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {label}
        {required ? <RequiredIndicator /> : null}
      </Label>
      <Input
        {...props}
        type={type}
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => {
          field.handleChange(event.target.value)
        }}
        required={required}
        aria-required={required}
        {...getFieldAriaProps(field)}
      />
      {hasError ? (
        <FieldError
          id={`${field.name}-error`}
          message={getErrorMessage(field.state.meta.errors[0])}
        />
      ) : null}
    </div>
  )
}

export const FormTextareaField = ({
  field,
  label,
  required = false,
  ...props
}: FormTextareaFieldProps) => {
  const hasError = field.state.meta.errors.length > 0

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {label}
        {required ? <RequiredIndicator /> : null}
      </Label>
      <Textarea
        {...props}
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => {
          field.handleChange(event.target.value)
        }}
        required={required}
        aria-required={required}
        {...getFieldAriaProps(field)}
      />
      {hasError ? (
        <FieldError
          id={`${field.name}-error`}
          message={getErrorMessage(field.state.meta.errors[0])}
        />
      ) : null}
    </div>
  )
}

export const FormCheckboxField = ({
  field,
  label,
  required = false
}: FormCheckboxFieldProps) => {
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <Checkbox
          id={field.name}
          className="mt-0.5"
          checked={field.state.value}
          onCheckedChange={(checked) => {
            field.handleChange(checked === true)
          }}
          onBlur={field.handleBlur}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${field.name}-error` : undefined}
          aria-required={required}
        />
        <Label
          htmlFor={field.name}
          className="block text-sm leading-relaxed font-normal text-muted-foreground"
        >
          {label}
          {required ? <RequiredIndicator /> : null}
        </Label>
      </div>
      {hasError ? (
        <FieldError
          id={`${field.name}-error`}
          message={getErrorMessage(field.state.meta.errors[0])}
        />
      ) : null}
    </div>
  )
}
