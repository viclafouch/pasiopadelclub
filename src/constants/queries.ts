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
    staleTime: 1000 * 60 * 15
  })
}

getAuthUserQueryOpts.all = ['auth-user'] as const

export const getSlotsByDateQueryOpts = (date: string) => {
  return queryOptions({
    queryKey: [...getSlotsByDateQueryOpts.all, date],
    queryFn: () => {
      return getSlotsByDateFn({ data: { date } })
    },
    staleTime: 1000 * 30
  })
}

getSlotsByDateQueryOpts.all = ['slots'] as const

export const getActiveBookingCountQueryOpts = () => {
  return queryOptions({
    queryKey: [...getActiveBookingCountQueryOpts.all],
    queryFn: getActiveBookingCountFn,
    staleTime: 1000 * 30
  })
}

getActiveBookingCountQueryOpts.all = ['bookings', 'active-count'] as const

export const getUpcomingBookingsQueryOpts = () => {
  return queryOptions({
    queryKey: [...getUpcomingBookingsQueryOpts.all],
    queryFn: getUpcomingBookingsFn,
    staleTime: 1000 * 30
  })
}

getUpcomingBookingsQueryOpts.all = ['bookings', 'upcoming'] as const

export const getBookingHistoryQueryOpts = () => {
  return queryOptions({
    queryKey: [...getBookingHistoryQueryOpts.all],
    queryFn: getBookingHistoryFn,
    staleTime: 1000 * 60 * 5
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
    staleTime: 1000 * 30
  })
}

getUserBalanceQueryOpts.all = ['wallet', 'balance'] as const

export const getWalletTransactionsQueryOpts = () => {
  return queryOptions({
    queryKey: [...getWalletTransactionsQueryOpts.all],
    queryFn: getWalletTransactionsFn,
    staleTime: 1000 * 30
  })
}

getWalletTransactionsQueryOpts.all = ['wallet', 'transactions'] as const

export const getCreditPacksQueryOpts = () => {
  return queryOptions({
    queryKey: [...getCreditPacksQueryOpts.all],
    queryFn: getCreditPacksFn,
    staleTime: 1000 * 60 * 60 * 24
  })
}

getCreditPacksQueryOpts.all = ['credit-packs'] as const

export const getNextExpiringCreditsQueryOpts = () => {
  return queryOptions({
    queryKey: [...getNextExpiringCreditsQueryOpts.all],
    queryFn: getNextExpiringCreditsFn,
    staleTime: 1000 * 60 * 5
  })
}

getNextExpiringCreditsQueryOpts.all = ['wallet', 'next-expiring'] as const
