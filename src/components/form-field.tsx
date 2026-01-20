import { getErrorMessage } from '@/helpers/error'
import type { AnyFieldApi } from '@tanstack/react-form'
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

const FieldError = ({ field }: { field: AnyFieldApi }) => {
  const hasError = field.state.meta.errors.length > 0

  return hasError ? (
    <p
      id={`${field.name}-error`}
      role="alert"
      className="text-sm text-destructive"
    >
      {getErrorMessage(field.state.meta.errors[0])}
    </p>
  ) : null
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
  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
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
      <FieldError field={field} />
    </div>
  )
}

export const FormTextareaField = ({
  field,
  label,
  required = false,
  ...props
}: FormTextareaFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
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
      <FieldError field={field} />
    </div>
  )
}
