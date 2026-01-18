import { Resend } from 'resend'
import { serverEnv } from '@/env/server'

export const resend = new Resend(serverEnv.RESEND_API_KEY)

const EMAIL_FROM_PROD = 'Pasio Padel Club <noreply@pasiopadelclub.fr>'

export const EMAIL_FROM = serverEnv.EMAIL_OVERRIDE_FROM ?? EMAIL_FROM_PROD

export const getEmailRecipient = (email: string) => {
  return serverEnv.EMAIL_OVERRIDE_TO ?? email
}
