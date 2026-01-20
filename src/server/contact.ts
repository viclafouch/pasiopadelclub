import { and, desc, eq, gt } from 'drizzle-orm'
import { CLUB_INFO } from '@/constants/app'
import { contactFormSchema } from '@/constants/schemas'
import { db } from '@/db'
import { booking, court } from '@/db/schema'
import { ContactEmail } from '@/emails'
import { formatDateTimeLongFr, nowParis } from '@/helpers/date'
import { auth } from '@/lib/auth'
import { EMAIL_FROM, getEmailRecipient, resend } from '@/lib/resend.server'
import { getUserBalance } from '@/utils/wallet'
import { createServerFn } from '@tanstack/react-start'
import {
  getRequestHeaders,
  setResponseStatus
} from '@tanstack/react-start/server'

export const submitContactFormFn = createServerFn({ method: 'POST' })
  .inputValidator(contactFormSchema)
  .handler(async ({ data }) => {
    const { name, email, subject, message } = data
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    let userInfo = null

    if (session) {
      const now = nowParis()
      const [balance, upcomingBookings, recentBookings] = await Promise.all([
        getUserBalance(session.user.id),
        db
          .select({ booking, court })
          .from(booking)
          .innerJoin(court, eq(booking.courtId, court.id))
          .where(
            and(
              eq(booking.userId, session.user.id),
              eq(booking.status, 'confirmed'),
              gt(booking.endAt, now)
            )
          )
          .orderBy(booking.startAt)
          .limit(5),
        db
          .select({ booking, court })
          .from(booking)
          .innerJoin(court, eq(booking.courtId, court.id))
          .where(eq(booking.userId, session.user.id))
          .orderBy(desc(booking.createdAt))
          .limit(10)
      ])

      userInfo = {
        id: session.user.id,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        email: session.user.email,
        phone: session.user.phone ?? null,
        createdAt: session.user.createdAt,
        balanceCents: balance,
        upcomingBookings: upcomingBookings.map((row) => {
          return {
            id: row.booking.id,
            courtName: row.court.name,
            startAt: row.booking.startAt,
            price: row.booking.price,
            status: row.booking.status,
            paymentType: row.booking.paymentType
          }
        }),
        recentBookings: recentBookings.map((row) => {
          return {
            id: row.booking.id,
            courtName: row.court.name,
            startAt: row.booking.startAt,
            price: row.booking.price,
            status: row.booking.status,
            paymentType: row.booking.paymentType
          }
        })
      }
    }

    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: getEmailRecipient(CLUB_INFO.email),
      replyTo: email,
      subject: `[Contact] ${subject}`,
      react: ContactEmail({
        name,
        email,
        subject,
        message,
        sentAt: formatDateTimeLongFr(nowParis()),
        userInfo
      })
    })

    if (result.error) {
      setResponseStatus(503)
      throw new Error("Erreur lors de l'envoi du message. Réessayez plus tard.")
    }

    return { success: true }
  })
