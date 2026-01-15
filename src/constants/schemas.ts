import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { booking, court, user } from '@/db/schema'

export const userSelectSchema = createSelectSchema(user)
export const userInsertSchema = createInsertSchema(user)

export const courtSelectSchema = createSelectSchema(court)

export const bookingSelectSchema = createSelectSchema(booking)
export const bookingInsertSchema = createInsertSchema(booking)

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().max(20).optional()
})

export const cancelBookingSchema = z.object({
  bookingId: z.uuid()
})

export const dateKeySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const getSlotsByDateSchema = z.object({
  date: dateKeySchema
})
