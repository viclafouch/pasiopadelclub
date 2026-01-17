import { and, eq, gt, isNull, or, sum } from 'drizzle-orm'
import type { User } from '@/constants/types'
import { db } from '@/db'
import { walletTransaction } from '@/db/schema'
import { nowParis } from '@/helpers/date'
import { createServerOnlyFn } from '@tanstack/react-start'

export const getUserBalance = createServerOnlyFn(async (userId: User['id']) => {
  const now = nowParis()
  const [result] = await db
    .select({ balance: sum(walletTransaction.amountCents) })
    .from(walletTransaction)
    .where(
      and(
        eq(walletTransaction.userId, userId),
        or(
          isNull(walletTransaction.expiresAt),
          gt(walletTransaction.expiresAt, now)
        )
      )
    )

  return Number(result?.balance ?? 0)
})
