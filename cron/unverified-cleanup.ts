/* eslint-disable no-console */

import { subDays } from 'date-fns'
import { and, eq, lt } from 'drizzle-orm'
import { db } from '@/db'
import { account, session, user } from '@/db/schema'
import { formatDateTimeFr, nowParis } from '@/helpers/date'
import { maskEmail } from '@/helpers/string'

const UNVERIFIED_ACCOUNT_EXPIRY_DAYS = 30

async function deleteUnverifiedUser(userId: string, userEmail: string) {
  try {
    await db.delete(session).where(eq(session.userId, userId))
    await db.delete(account).where(eq(account.userId, userId))
    await db.delete(user).where(eq(user.id, userId))

    console.log('[UnverifiedCleanup] Deleted:', maskEmail(userEmail))

    return true
  } catch (error) {
    console.error(
      '[UnverifiedCleanup] Failed to delete:',
      maskEmail(userEmail),
      error
    )

    return false
  }
}

async function main() {
  console.log('[UnverifiedCleanup] Starting at', formatDateTimeFr(nowParis()))

  const now = nowParis()
  const expiryDate = subDays(now, UNVERIFIED_ACCOUNT_EXPIRY_DAYS)

  console.log('[UnverifiedCleanup] Expiry threshold:', {
    days: UNVERIFIED_ACCOUNT_EXPIRY_DAYS,
    cutoffDate: formatDateTimeFr(expiryDate)
  })

  const usersToDelete = await db
    .select({
      id: user.id,
      email: user.email
    })
    .from(user)
    .where(and(eq(user.emailVerified, false), lt(user.createdAt, expiryDate)))

  console.log('[UnverifiedCleanup] Found:', usersToDelete.length, 'users')

  if (usersToDelete.length === 0) {
    console.log('[UnverifiedCleanup] No unverified accounts to cleanup')
    process.exit(0)
  }

  const results = await Promise.allSettled(
    usersToDelete.map((userData) => {
      return deleteUnverifiedUser(userData.id, userData.email)
    })
  )

  const successCount = results.filter((result) => {
    return result.status === 'fulfilled' && result.value === true
  }).length
  const failCount = usersToDelete.length - successCount

  console.log('[UnverifiedCleanup] Complete:', {
    deleted: successCount,
    failed: failCount
  })

  process.exit(failCount > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error('[UnverifiedCleanup] Fatal error:', error)
  process.exit(1)
})
