import { Resend as ResendAPI } from 'resend'
import Resend from '@auth/core/providers/resend'
import { generateRandomString, type RandomReader } from '@oslojs/crypto/random'
import { convexEnv } from './env'

export const ResendOTPPasswordReset = Resend({
  id: 'resend-otp',
  apiKey: convexEnv.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes)
      }
    }

    const alphabet = '0123456789'
    const length = 8

    return generateRandomString(random, alphabet, length)
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey)
    const { error } = await resend.emails.send({
      from: 'Pasio Padel Club <onboarding@resend.dev>',
      to: [email],
      subject: 'Réinitialisation de votre mot de passe - Pasio Padel Club',
      text: `Votre code de réinitialisation est : ${token}\n\nCe code expire dans 1 heure.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.`
    })

    if (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      throw new Error('Could not send password reset email')
    }
  }
})
