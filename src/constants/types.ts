import type { InferSelectModel } from 'drizzle-orm'
import type { z } from 'zod'
import type {
  blockedSlot,
  booking,
  court,
  creditPack,
  user,
  walletTransaction
} from '@/db/schema'
import type { bookingSlotSchema } from './schemas'

// Base entity types from Drizzle schema
export type BlockedSlot = InferSelectModel<typeof blockedSlot>
export type Booking = InferSelectModel<typeof booking>
export type Court = InferSelectModel<typeof court>
export type CreditPack = InferSelectModel<typeof creditPack>
export type User = InferSelectModel<typeof user>
export type WalletTransaction = InferSelectModel<typeof walletTransaction>

// Composite types
export type BookingWithCourt = Booking & { court: Court }

// Slot types (client-side with timestamps in ms)
export type SlotStatus = 'available' | 'booked' | 'blocked' | 'past'

export type Slot = {
  startAt: number
  endAt: number
  status: SlotStatus
  isOwnBooking: boolean
}

export type CourtWithSlots = {
  court: Court
  slots: Slot[]
  hasAvailableSlot: boolean
}

export type SelectedSlot = {
  court: Court
  slot: Slot
  dateKey: string
}

// Input types for server functions
export type BookingSlotData = z.infer<typeof bookingSlotSchema>
