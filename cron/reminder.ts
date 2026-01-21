/* eslint-disable no-console */

import { addHours } from 'date-fns'
import { and, eq, gt, lt } from 'drizzle-orm'
import { db } from '@/db'
import { booking, court, user } from '@/db/schema'
import { BookingReminderEmail } from '@/emails'
import { serverEnv } from '@/env/server'
import {
  formatDateTimeFr,
  formatFullDateLabel,
  formatTimeFr,
  nowParis
} from '@/helpers/date'
import { extractFirstName } from '@/helpers/string'
import { EMAIL_FROM, getEmailRecipient, resend } from '@/lib/resend.server'

function maskEmail(email: string) {
  const [local = '', domain = ''] = email.split('@')
  const firstChar = local[0] ?? '?'

  return `${firstChar}***@${domain}`
}

type ReminderEmailParams = {
  bookingId: string
  userEmail: string
  userName: string
  userFirstName: string | null
  courtName: string
  startAt: Date
  endAt: Date
}

async function sendReminderEmail(
  params: ReminderEmailParams
): Promise<boolean> {
  const {
    bookingId,
    userEmail,
    userName,
    userFirstName,
    courtName,
    startAt,
    endAt
  } = params

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: getEmailRecipient(userEmail),
      subject: `Rappel - ${courtName} demain à ${formatTimeFr(startAt)}`,
      react: BookingReminderEmail({
        firstName: userFirstName ?? extractFirstName(userName),
        courtName,
        date: formatFullDateLabel(startAt),
        startTime: formatTimeFr(startAt),
        endTime: formatTimeFr(endAt),
        baseUrl: serverEnv.VITE_SITE_URL
      })
    })

    await db
      .update(booking)
      .set({ reminderSent: true })
      .where(eq(booking.id, bookingId))

    console.log('[Reminder] Email sent:', maskEmail(userEmail))

    return true
  } catch (error) {
    console.error('[Reminder] Failed:', maskEmail(userEmail), error)

    return false
  }
}

async function main() {
  console.log('[Reminder] Starting at', formatDateTimeFr(nowParis()))

  const now = nowParis()
  const windowStart = addHours(now, 23)
  const windowEnd = addHours(now, 25)

  console.log('[Reminder] Window:', {
    from: formatDateTimeFr(windowStart),
    to: formatDateTimeFr(windowEnd)
  })

  const bookingsToRemind = await db
    .select({
      id: booking.id,
      startAt: booking.startAt,
      endAt: booking.endAt,
      userName: user.name,
      userFirstName: user.firstName,
      userEmail: user.email,
      courtName: court.name
    })
    .from(booking)
    .innerJoin(user, eq(booking.userId, user.id))
    .innerJoin(court, eq(booking.courtId, court.id))
    .where(
      and(
        eq(booking.status, 'confirmed'),
        eq(booking.reminderSent, false),
        gt(booking.startAt, windowStart),
        lt(booking.startAt, windowEnd)
      )
    )

  console.log('[Reminder] Found:', bookingsToRemind.length, 'bookings')

  if (bookingsToRemind.length === 0) {
    console.log('[Reminder] No reminders to send')
    process.exit(0)
  }

  const results = await Promise.allSettled(
    bookingsToRemind.map((bookingData) => {
      return sendReminderEmail({
        bookingId: bookingData.id,
        userEmail: bookingData.userEmail,
        userName: bookingData.userName,
        userFirstName: bookingData.userFirstName,
        courtName: bookingData.courtName,
        startAt: bookingData.startAt,
        endAt: bookingData.endAt
      })
    })
  )

  const successCount = results.filter((result) => {
    return result.status === 'fulfilled' && result.value === true
  }).length
  const failCount = bookingsToRemind.length - successCount

  console.log('[Reminder] Complete:', {
    success: successCount,
    failed: failCount
  })

  process.exit(failCount > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error('[Reminder] Fatal error:', error)
  process.exit(1)
})
