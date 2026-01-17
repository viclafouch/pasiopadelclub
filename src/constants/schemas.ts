import { z } from 'zod'

export const updateProfileSchema = z.object({
  firstName: z.string().nonempty().max(50),
  lastName: z.string().nonempty().max(50),
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
