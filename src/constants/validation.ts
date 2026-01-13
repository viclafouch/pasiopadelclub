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
