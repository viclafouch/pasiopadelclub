import { MINUTE, SECOND } from '@/constants/time'
import { getCurrentUserFn } from '@/server/auth'
import {
  getActiveBookingCountFn,
  getBookingHistoryFn,
  getLatestBookingFn,
  getUpcomingBookingsFn
} from '@/server/bookings'
import { getSlotsByDateFn } from '@/server/slots'
import {
  getCreditPacksFn,
  getNextExpiringCreditsFn,
  getUserBalanceFn,
  getWalletTransactionsFn
} from '@/server/wallet'
import { queryOptions } from '@tanstack/react-query'

export const getAuthUserQueryOpts = () => {
  return queryOptions({
    queryKey: [...getAuthUserQueryOpts.all],
    queryFn: getCurrentUserFn,
    staleTime: 15 * MINUTE
  })
}

getAuthUserQueryOpts.all = ['auth-user'] as const

export const getSlotsByDateQueryOpts = (date: string) => {
  return queryOptions({
    queryKey: [...getSlotsByDateQueryOpts.all, date],
    queryFn: () => {
      return getSlotsByDateFn({ data: { date } })
    },
    staleTime: 30 * SECOND
  })
}

getSlotsByDateQueryOpts.all = ['slots'] as const

export const getActiveBookingCountQueryOpts = () => {
  return queryOptions({
    queryKey: [...getActiveBookingCountQueryOpts.all],
    queryFn: getActiveBookingCountFn,
    staleTime: 30 * SECOND
  })
}

getActiveBookingCountQueryOpts.all = ['bookings', 'active-count'] as const

export const getUpcomingBookingsQueryOpts = () => {
  return queryOptions({
    queryKey: [...getUpcomingBookingsQueryOpts.all],
    queryFn: getUpcomingBookingsFn,
    staleTime: 5 * MINUTE
  })
}

getUpcomingBookingsQueryOpts.all = ['bookings', 'upcoming'] as const

export const getBookingHistoryQueryOpts = () => {
  return queryOptions({
    queryKey: [...getBookingHistoryQueryOpts.all],
    queryFn: getBookingHistoryFn,
    staleTime: 10 * MINUTE
  })
}

getBookingHistoryQueryOpts.all = ['bookings', 'history'] as const

export const getLatestBookingQueryOpts = () => {
  return queryOptions({
    queryKey: [...getLatestBookingQueryOpts.all],
    queryFn: getLatestBookingFn,
    staleTime: 0
  })
}

getLatestBookingQueryOpts.all = ['bookings', 'latest'] as const

export const getUserBalanceQueryOpts = () => {
  return queryOptions({
    queryKey: [...getUserBalanceQueryOpts.all],
    queryFn: getUserBalanceFn,
    staleTime: 5 * MINUTE
  })
}

getUserBalanceQueryOpts.all = ['wallet', 'balance'] as const

export const getWalletTransactionsQueryOpts = () => {
  return queryOptions({
    queryKey: [...getWalletTransactionsQueryOpts.all],
    queryFn: getWalletTransactionsFn,
    staleTime: 2 * MINUTE
  })
}

getWalletTransactionsQueryOpts.all = ['wallet', 'transactions'] as const

export const getCreditPacksQueryOpts = () => {
  return queryOptions({
    queryKey: [...getCreditPacksQueryOpts.all],
    queryFn: getCreditPacksFn,
    staleTime: Infinity
  })
}

getCreditPacksQueryOpts.all = ['credit-packs'] as const

export const getNextExpiringCreditsQueryOpts = () => {
  return queryOptions({
    queryKey: [...getNextExpiringCreditsQueryOpts.all],
    queryFn: getNextExpiringCreditsFn,
    staleTime: 10 * MINUTE
  })
}

getNextExpiringCreditsQueryOpts.all = ['wallet', 'next-expiring'] as const
