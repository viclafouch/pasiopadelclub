import type { Doc, Id } from '~/convex/_generated/dataModel'

export type BlockedSlot = Doc<'blockedSlots'>
export type Booking = Doc<'bookings'>
export type Court = Doc<'courts'>
export type User = Doc<'users'>

export type BookingId = Id<'bookings'>
export type CourtId = Id<'courts'>
export type UserId = Id<'users'>

export type BookingWithCourt = Booking & { court: Court }

export type SlotStatus = 'available' | 'booked' | 'blocked' | 'past'

export type Slot = {
  startAt: number
  endAt: number
  status: SlotStatus
}

export type CourtWithSlots = {
  court: Court
  slots: Slot[]
}
