import { EMAIL_RESEND_COOLDOWN_SECONDS } from '@/constants/app'
import { authClient } from '@/lib/auth-client'
import { useMutation } from '@tanstack/react-query'
import { useCooldown } from './use-cooldown'

const VERIFICATION_CALLBACK_URL = '/mon-compte?email-verified=true'

type UseResendVerificationEmailParams = {
  email: string
}

export function useResendVerificationEmail({
  email
}: UseResendVerificationEmailParams) {
  const cooldown = useCooldown({
    durationSeconds: EMAIL_RESEND_COOLDOWN_SECONDS
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: VERIFICATION_CALLBACK_URL
      })

      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      cooldown.start()
    }
  })

  return { mutation, cooldown }
}
