import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js/min'
import { z } from 'zod'

const DEFAULT_COUNTRY = 'FR'

const optionalPhoneSchema = z
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

const profileBaseSchema = z.object({
  firstName: z.string().nonempty().max(50),
  lastName: z.string().nonempty().max(50)
})

export const profileFormSchema = profileBaseSchema.extend({
  phone: optionalPhoneSchema
})

export const updateProfileSchema = profileBaseSchema.extend({
  phone: z.string().max(20).optional()
})

export const cancelBookingSchema = z.object({
  bookingId: z.uuid()
})

export const dateKeySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const bookingSlotSchema = z.object({
  courtId: z.uuid(),
  startAt: z.number(),
  endAt: z.number()
})

export const getSlotsByDateSchema = z.object({
  date: dateKeySchema
})

export const creditPackIdSchema = z.object({
  packId: z.uuid()
})

const toNumber = z.string().transform(Number)
const toDate = z.string().transform((value) => {
  return new Date(Number(value))
})

export const creditPackMetadataSchema = z.object({
  packId: z.uuid(),
  userId: z.uuid(),
  creditsCents: toNumber,
  validityMonths: toNumber
})

export const bookingMetadataSchema = z.object({
  courtId: z.uuid(),
  userId: z.uuid(),
  startAt: toDate,
  endAt: toDate
})

export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email().max(254),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000)
})

export const strongPasswordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(100, 'Le mot de passe est trop long')
  .regex(/[a-z]/, 'Doit contenir au moins une lettre minuscule')
  .regex(/[A-Z]/, 'Doit contenir au moins une lettre majuscule')
  .regex(/[0-9]/, 'Doit contenir au moins un chiffre')

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'Confirmez le nouveau mot de passe')
  })
  .refine(
    (data) => {
      return data.newPassword === data.confirmPassword
    },
    {
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword']
    }
  )
