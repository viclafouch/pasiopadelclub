import { FULL_REFUND_HOURS_LIMIT, MS_PER_HOUR } from '@/constants/booking'
import type { Booking } from '@/constants/types'
import { nowParis } from '@/helpers/date'

export function matchIsFullRefund(startAt: Date) {
  const hoursUntilBooking =
    (startAt.getTime() - nowParis().getTime()) / MS_PER_HOUR

  return hoursUntilBooking >= FULL_REFUND_HOURS_LIMIT
}

type BookingTimeRange = Pick<Booking, 'startAt' | 'endAt'>

export function matchIsBookingInProgress(booking: BookingTimeRange) {
  const now = nowParis().getTime()
  const start = new Date(booking.startAt).getTime()
  const end = new Date(booking.endAt).getTime()

  return start <= now && now < end
}
