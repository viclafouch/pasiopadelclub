import { AlertTriangleIcon, CheckIcon, RefreshCwIcon } from 'lucide-react'
import { LoadingButton } from '@/components/loading-button'
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert'
import { getErrorMessage } from '@/helpers/error'
import { useResendVerificationEmail } from '@/hooks/use-resend-verification-email'

type EmailVerificationAlertProps = {
  email: string
}

export const EmailVerificationAlert = ({
  email
}: EmailVerificationAlertProps) => {
  const { mutation, cooldown } = useResendVerificationEmail({ email })

  return (
    <Alert variant="warning" className="mb-6">
      <AlertTriangleIcon aria-hidden="true" />
      <AlertTitle>Adresse email non vérifiée</AlertTitle>
      <AlertDescription>
        Confirmez votre adresse email pour pouvoir réserver un terrain.
        <br />
        {mutation.isSuccess && cooldown.isActive ? (
          <span
            role="status"
            className="flex items-center gap-1 text-sm text-green-700 dark:text-green-400"
          >
            <CheckIcon className="size-4" aria-hidden="true" />
            Email envoyé
          </span>
        ) : null}
        {mutation.isError ? (
          <span role="alert" className="text-sm text-destructive">
            {getErrorMessage(mutation.error)}
          </span>
        ) : null}
      </AlertDescription>
      <AlertAction>
        <LoadingButton
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            mutation.mutate()
          }}
          // Exception: disabled pendant le cooldown pour éviter le spam email
          disabled={cooldown.isActive}
          isLoading={mutation.isPending}
        >
          <RefreshCwIcon className="size-4" aria-hidden="true" />
          {cooldown.isActive ? (
            <>
              Renvoyer dans{' '}
              <span className="tabular-nums">{cooldown.remainingSeconds}s</span>
            </>
          ) : (
            "Renvoyer l'email"
          )}
        </LoadingButton>
      </AlertAction>
    </Alert>
  )
}
