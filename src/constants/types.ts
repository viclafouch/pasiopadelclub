import type { InferSelectModel } from 'drizzle-orm'
import type { blockedSlot, booking, court, user } from '@/db/schema'

// Base entity types from Drizzle schema
export type BlockedSlot = InferSelectModel<typeof blockedSlot>
export type Booking = InferSelectModel<typeof booking>
export type Court = InferSelectModel<typeof court>
export type User = InferSelectModel<typeof user>

// Derived types - use Entity['field'] pattern instead of separate aliases
export type CourtType = Court['type']
export type CourtLocation = Court['location']
export type BookingStatus = Booking['status']

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
}

export type SelectedSlot = {
  court: Court
  slot: Slot
  dateKey: string
}
