/* eslint-disable no-console */

import { subYears } from 'date-fns'
import { and, eq, lt, max, sql } from 'drizzle-orm'
import { db } from '@/db'
import { booking, session, user, walletTransaction } from '@/db/schema'
import { formatDateTimeFr, nowParis } from '@/helpers/date'
import { anonymizeUser } from '@/utils/user'

const INACTIVITY_YEARS = 3

function maskId(id: string) {
  return `${id.slice(0, 8)}...`
}

async function getLastActivityDates(userIds: string[]) {
  if (userIds.length === 0) {
    return new Map()
  }

  const [bookingActivity, transactionActivity, sessionActivity] =
    await Promise.all([
      db
        .select({
          userId: booking.userId,
          lastDate: max(booking.createdAt)
        })
        .from(booking)
        .where(sql`${booking.userId} IN ${userIds}`)
        .groupBy(booking.userId),
      db
        .select({
          userId: walletTransaction.userId,
          lastDate: max(walletTransaction.createdAt)
        })
        .from(walletTransaction)
        .where(sql`${walletTransaction.userId} IN ${userIds}`)
        .groupBy(walletTransaction.userId),
      db
        .select({
          userId: session.userId,
          lastDate: max(session.createdAt)
        })
        .from(session)
        .where(sql`${session.userId} IN ${userIds}`)
        .groupBy(session.userId)
    ])

  const activityMap = new Map<string, Date>()

  const allActivity = [
    ...bookingActivity,
    ...transactionActivity,
    ...sessionActivity
  ]

  for (const { userId, lastDate } of allActivity) {
    if (!lastDate) {
      continue
    }

    const existing = activityMap.get(userId)

    if (!existing || lastDate > existing) {
      activityMap.set(userId, lastDate)
    }
  }

  return activityMap
}

async function anonymizeInactiveAccounts() {
  const cutoffDate = subYears(nowParis(), INACTIVITY_YEARS)

  console.log('[Retention] Cutoff date:', formatDateTimeFr(cutoffDate))

  const potentiallyInactiveUsers = await db
    .select({ id: user.id, email: user.email, updatedAt: user.updatedAt })
    .from(user)
    .where(and(eq(user.isAnonymized, false), lt(user.updatedAt, cutoffDate)))

  console.log(
    '[Retention] Found',
    potentiallyInactiveUsers.length,
    'potentially inactive users'
  )

  if (potentiallyInactiveUsers.length === 0) {
    return 0
  }

  const userIds = potentiallyInactiveUsers.map((inactiveUser) => {
    return inactiveUser.id
  })
  const activityMap = await getLastActivityDates(userIds)

  const usersToAnonymize = potentiallyInactiveUsers.filter((inactiveUser) => {
    const lastActivity = activityMap.get(inactiveUser.id)

    if (lastActivity && lastActivity >= cutoffDate) {
      console.log(
        '[Retention] Skipping',
        maskId(inactiveUser.id),
        '- last activity:',
        formatDateTimeFr(lastActivity)
      )

      return false
    }

    return true
  })

  await Promise.all(
    usersToAnonymize.map(async (inactiveUser) => {
      await anonymizeUser(inactiveUser.id)
      console.log('[Retention] Anonymized user:', maskId(inactiveUser.id))
    })
  )

  return usersToAnonymize.length
}

async function deleteExpiredSessions() {
  const now = nowParis()

  const result = await db
    .delete(session)
    .where(lt(session.expiresAt, now))
    .returning({ id: session.id })

  return result.length
}

async function main() {
  console.log('[Retention] Starting at', formatDateTimeFr(nowParis()))

  const [anonymizedCount, deletedSessionsCount] = await Promise.all([
    anonymizeInactiveAccounts(),
    deleteExpiredSessions()
  ])

  console.log('[Retention] Complete:', {
    anonymizedAccounts: anonymizedCount,
    deletedSessions: deletedSessionsCount
  })

  process.exit(0)
}

main().catch((error) => {
  console.error('[Retention] Fatal error:', error)
  process.exit(1)
})
