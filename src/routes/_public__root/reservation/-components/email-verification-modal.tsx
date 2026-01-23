import {
  AlertTriangleIcon,
  CheckIcon,
  MailIcon,
  RefreshCwIcon
} from 'lucide-react'
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
import { getErrorMessage } from '@/helpers/error'
import { useResendVerificationEmail } from '@/hooks/use-resend-verification-email'

type EmailVerificationModalProps = {
  email: string
  onClose: () => void
}

export const EmailVerificationModal = ({
  email,
  onClose
}: EmailVerificationModalProps) => {
  const { mutation, cooldown } = useResendVerificationEmail({ email })

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3 text-center sm:text-left">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 sm:mx-0">
            <AlertTriangleIcon
              className="size-6 text-amber-600"
              aria-hidden="true"
            />
          </div>
          <DialogTitle>Vérifiez votre adresse email</DialogTitle>
          <DialogDescription>
            Pour réserver un terrain, vous devez d&apos;abord confirmer votre
            adresse email.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pb-2">
          <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
            <MailIcon
              className="size-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-sm font-medium">{email}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Un email de confirmation vous a été envoyé lors de votre
            inscription. Cliquez sur le lien dans cet email pour activer votre
            compte.
          </p>
          {mutation.isSuccess && cooldown.isActive ? (
            <div
              role="status"
              className="flex items-center gap-2 text-sm text-green-600"
            >
              <CheckIcon className="size-4" aria-hidden="true" />
              Email envoyé avec succès
            </div>
          ) : null}
          {mutation.isError ? (
            <div role="alert" className="text-sm text-destructive">
              {getErrorMessage(mutation.error)}
            </div>
          ) : null}
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <LoadingButton
            type="button"
            variant="default"
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
                <span className="tabular-nums">
                  {cooldown.remainingSeconds}s
                </span>
              </>
            ) : (
              "Renvoyer l'email"
            )}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
