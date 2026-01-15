import type { User } from '@/constants/types'
import { getCurrentUserFn } from '@/server/auth'
import {
  getActiveBookingCountFn,
  getBookingHistoryFn,
  getUpcomingBookingsFn
} from '@/server/bookings'
import { getSlotsByDateFn } from '@/server/slots'
import { queryOptions } from '@tanstack/react-query'

export const getAuthUserQueryOpts = () => {
  return queryOptions({
    queryKey: [...getAuthUserQueryOpts.all],
    queryFn: async () => {
      return getCurrentUserFn()
    },
    staleTime: 1000 * 60 * 5
  })
}

getAuthUserQueryOpts.all = ['auth-user'] as const

export const getSlotsByDateQueryOpts = (
  date: string,
  currentUserId?: User['id']
) => {
  return queryOptions({
    queryKey: [...getSlotsByDateQueryOpts.all, date, currentUserId],
    queryFn: async () => {
      return getSlotsByDateFn({ data: { date, currentUserId } })
    },
    staleTime: 1000 * 30
  })
}

getSlotsByDateQueryOpts.all = ['slots'] as const

export const getActiveBookingCountQueryOpts = () => {
  return queryOptions({
    queryKey: [...getActiveBookingCountQueryOpts.all],
    queryFn: async () => {
      return getActiveBookingCountFn()
    },
    staleTime: 1000 * 30
  })
}

getActiveBookingCountQueryOpts.all = ['bookings', 'active-count'] as const

export const getUpcomingBookingsQueryOpts = () => {
  return queryOptions({
    queryKey: [...getUpcomingBookingsQueryOpts.all],
    queryFn: async () => {
      return getUpcomingBookingsFn()
    },
    staleTime: 1000 * 30
  })
}

getUpcomingBookingsQueryOpts.all = ['bookings', 'upcoming'] as const

export const getBookingHistoryQueryOpts = () => {
  return queryOptions({
    queryKey: [...getBookingHistoryQueryOpts.all],
    queryFn: async () => {
      return getBookingHistoryFn()
    },
    staleTime: 1000 * 60
  })
}

getBookingHistoryQueryOpts.all = ['bookings', 'history'] as const
