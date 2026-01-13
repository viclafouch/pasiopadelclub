import { z } from 'zod'

export const phoneSchema = z
  .string()
  .min(10, 'Le numéro doit contenir au moins 10 chiffres')
  .max(20, 'Le numéro est trop long')
  .transform((value) => {
    return value.replace(/[\s-]/g, '')
  })
  .refine(
    (value) => {
      return /^\+?[0-9]{10,15}$/.test(value)
    },
    { message: 'Format de téléphone invalide' }
  )

export const phoneFormSchema = z.object({
  phone: phoneSchema
})

export const optionalPhoneSchema = z
  .string()
  .transform((value) => {
    return value.replace(/[\s-]/g, '')
  })
  .refine(
    (value) => {
      return value === '' || /^\+?[0-9]{10,15}$/.test(value)
    },
    { message: 'Format de téléphone invalide' }
  )

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
