import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js/min'
import { z } from 'zod'

const DEFAULT_COUNTRY = 'FR'

export const phoneSchema = z
  .string()
  .min(1, 'Le numéro de téléphone est requis')
  .refine(
    (value) => {
      return isValidPhoneNumber(value, DEFAULT_COUNTRY)
    },
    {
      message: 'Format de téléphone invalide'
    }
  )
  .transform((value) => {
    return parsePhoneNumber(value, DEFAULT_COUNTRY).format('E.164')
  })

export const phoneFormSchema = z.object({
  phone: phoneSchema
})

export const optionalPhoneSchema = z
  .string()
  .refine(
    (value) => {
      return value === '' || isValidPhoneNumber(value, DEFAULT_COUNTRY)
    },
    { message: 'Format de téléphone invalide' }
  )
  .transform((value) => {
    return value === ''
      ? ''
      : parsePhoneNumber(value, DEFAULT_COUNTRY).format('E.164')
  })

export const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .max(50, 'Le prénom est trop long'),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .max(50, 'Le nom est trop long'),
  phone: optionalPhoneSchema
})
