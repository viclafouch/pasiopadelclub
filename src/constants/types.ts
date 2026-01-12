import type { Doc, Id } from '~/convex/_generated/dataModel'

export type Court = Doc<'courts'>
export type Booking = Doc<'bookings'>
export type User = Doc<'users'>

export type CourtId = Id<'courts'>
export type BookingId = Id<'bookings'>
export type UserId = Id<'users'>

export type BookingWithCourt = Booking & { court: Court }
