/* eslint-disable no-console */

import { addDays, subHours } from 'date-fns'
import { and, eq, gt, lt } from 'drizzle-orm'
import { randomBytes } from 'node:crypto'
import { db } from '@/db'
import { user, verification } from '@/db/schema'
import { VerificationReminderEmail } from '@/emails'
import { serverEnv } from '@/env/server'
import { formatDateTimeFr, nowParis } from '@/helpers/date'
import { extractFirstName, maskEmail } from '@/helpers/string'
import { EMAIL_FROM, getEmailRecipient, resend } from '@/lib/resend.server'

const REMINDER_HOURS = 48
const REMINDER_WINDOW_HOURS = 12
const TOKEN_EXPIRY_DAYS = 1

function generateToken() {
  return randomBytes(32).toString('hex')
}

function buildVerificationUrl(token: string) {
  const baseUrl = serverEnv.VITE_SITE_URL
  const callbackUrl = encodeURIComponent('/')

  return `${baseUrl}/api/auth/verify-email?token=${token}&callbackURL=${callbackUrl}`
}

type ReminderParams = {
  userId: string
  userEmail: string
  userName: string
  userFirstName: string | null
}

async function sendVerificationReminder(params: ReminderParams) {
  const { userId, userEmail, userName, userFirstName } = params

  try {
    const token = generateToken()
    const expiresAt = addDays(nowParis(), TOKEN_EXPIRY_DAYS)

    await db.insert(verification).values({
      identifier: userEmail,
      value: token,
      expiresAt
    })

    const verificationUrl = buildVerificationUrl(token)

    await resend.emails.send({
      from: EMAIL_FROM,
      to: getEmailRecipient(userEmail),
      subject: 'Rappel : Confirmez votre adresse email - Pasio Padel Club',
      react: VerificationReminderEmail({
        firstName: userFirstName ?? extractFirstName(userName),
        verificationUrl
      })
    })

    await db
      .update(user)
      .set({ verificationReminderSent: true })
      .where(eq(user.id, userId))

    console.log('[VerificationReminder] Email sent:', maskEmail(userEmail))

    return true
  } catch (error) {
    console.error('[VerificationReminder] Failed:', maskEmail(userEmail), error)

    return false
  }
}

async function main() {
  console.log(
    '[VerificationReminder] Starting at',
    formatDateTimeFr(nowParis())
  )

  const now = nowParis()
  const windowStart = subHours(now, REMINDER_HOURS + REMINDER_WINDOW_HOURS / 2)
  const windowEnd = subHours(now, REMINDER_HOURS - REMINDER_WINDOW_HOURS / 2)

  console.log('[VerificationReminder] Window:', {
    reminderAfterHours: REMINDER_HOURS,
    from: formatDateTimeFr(windowStart),
    to: formatDateTimeFr(windowEnd)
  })

  const usersToRemind = await db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      firstName: user.firstName
    })
    .from(user)
    .where(
      and(
        eq(user.emailVerified, false),
        eq(user.verificationReminderSent, false),
        gt(user.createdAt, windowStart),
        lt(user.createdAt, windowEnd)
      )
    )

  console.log('[VerificationReminder] Found:', usersToRemind.length, 'users')

  if (usersToRemind.length === 0) {
    console.log('[VerificationReminder] No reminders to send')
    process.exit(0)
  }

  const results = await Promise.allSettled(
    usersToRemind.map((userData) => {
      return sendVerificationReminder({
        userId: userData.id,
        userEmail: userData.email,
        userName: userData.name,
        userFirstName: userData.firstName
      })
    })
  )

  const successCount = results.filter((result) => {
    return result.status === 'fulfilled' && result.value === true
  }).length
  const failCount = usersToRemind.length - successCount

  console.log('[VerificationReminder] Complete:', {
    sent: successCount,
    failed: failCount
  })

  process.exit(failCount > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error('[VerificationReminder] Fatal error:', error)
  process.exit(1)
})
