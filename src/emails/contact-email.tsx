import type { Booking, Court, User } from '@/constants/types'
import { formatDateFr, formatTimeFr } from '@/helpers/date'
import { formatCentsToEuros } from '@/helpers/number'
import { Button, Link, Section, Text } from '@react-email/components'
import { EmailLayout } from './email-layout'

type ContactUserBooking = Pick<
  Booking,
  'id' | 'startAt' | 'price' | 'status' | 'paymentType'
> & {
  courtName: Court['name']
}

type ContactUserInfo = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'createdAt'
> & {
  balanceCents: number
  upcomingBookings: ContactUserBooking[]
  recentBookings: ContactUserBooking[]
}

type ContactEmailProps = {
  name: string
  email: string
  subject: string
  message: string
  sentAt: string
  userInfo?: ContactUserInfo | null
}

const BOOKING_STATUS_LABELS = {
  confirmed: '✅ Confirmée',
  cancelled: '❌ Annulée',
  completed: '✔️ Terminée',
  pending: '⏳ En attente',
  expired: '⌛ Expirée'
} as const satisfies Record<Booking['status'], string>

const BOOKING_PAYMENT_TYPE_LABELS = {
  online: '💳 CB',
  credit: '💰 Crédits',
  free: '🎁 Gratuit'
} as const satisfies Record<NonNullable<Booking['paymentType']>, string>

export const ContactEmail = ({
  name,
  email,
  subject,
  message,
  sentAt,
  userInfo = null
}: ContactEmailProps) => {
  return (
    <EmailLayout preview={`Nouveau message de ${name}`}>
      <Section className="mb-6 rounded-lg bg-brand p-6 text-center">
        <Text className="m-0 text-4xl">📬</Text>
        <Text className="m-0 mt-2 text-lg font-semibold text-white">
          Nouveau message de contact
        </Text>
      </Section>
      <Text className="m-0 text-xl font-semibold text-white">
        Message de {name}
      </Text>
      <Text className="mt-4 text-base leading-7 text-slate-300">
        Un visiteur a envoyé un message via le formulaire de contact du site.
      </Text>
      <Section className="my-8 overflow-hidden rounded-lg border border-slate-700">
        <table cellPadding="0" cellSpacing="0" width="100%">
          <tr>
            <td className="bg-brand p-4">
              <Text className="m-0 text-center text-sm font-semibold uppercase tracking-wide text-white">
                Informations de contact
              </Text>
            </td>
          </tr>
        </table>
        <table cellPadding="0" cellSpacing="0" width="100%" className="p-6">
          <tr>
            <td className="border-b border-slate-700 px-6 py-4">
              <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                Nom
              </Text>
              <Text className="m-0 mt-1 text-base font-semibold text-white">
                {name}
              </Text>
            </td>
          </tr>
          <tr>
            <td className="border-b border-slate-700 px-6 py-4">
              <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                Email
              </Text>
              <Link
                href={`mailto:${email}`}
                className="mt-1 block text-base font-semibold text-brand-light no-underline"
              >
                {email}
              </Link>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4">
              <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                Date d&apos;envoi
              </Text>
              <Text className="m-0 mt-1 text-base text-slate-300">
                {sentAt}
              </Text>
            </td>
          </tr>
        </table>
      </Section>
      <Section className="rounded-lg bg-slate-700 p-6">
        <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
          Objet
        </Text>
        <Text className="m-0 mt-2 text-lg font-semibold text-white">
          {subject}
        </Text>
        <Text className="m-0 mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
          Message
        </Text>
        <Text className="m-0 mt-3 whitespace-pre-wrap text-base leading-7 text-white">
          {message}
        </Text>
      </Section>
      <Section className="mt-8 text-center">
        <Button
          href={`mailto:${email}?subject=Re: Votre message sur Pasio Padel Club`}
          className="inline-block rounded-lg bg-brand-light px-8 py-4 text-center text-base font-semibold text-slate-900 no-underline"
        >
          Répondre à {name}
        </Button>
      </Section>
      {userInfo ? (
        <Section className="mt-8 overflow-hidden rounded-lg border border-slate-700">
          <table cellPadding="0" cellSpacing="0" width="100%">
            <tr>
              <td className="bg-emerald-600 p-4">
                <Text className="m-0 text-center text-sm font-semibold uppercase tracking-wide text-white">
                  🔐 Compte utilisateur connecté
                </Text>
              </td>
            </tr>
          </table>
          <table cellPadding="0" cellSpacing="0" width="100%" className="p-6">
            <tr>
              <td className="border-b border-slate-700 px-6 py-4">
                <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                  ID Utilisateur
                </Text>
                <Text className="m-0 mt-1 font-mono text-sm text-white">
                  {userInfo.id}
                </Text>
              </td>
            </tr>
            <tr>
              <td className="border-b border-slate-700 px-6 py-4">
                <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Nom complet
                </Text>
                <Text className="m-0 mt-1 text-base font-semibold text-white">
                  {userInfo.firstName} {userInfo.lastName}
                </Text>
              </td>
            </tr>
            <tr>
              <td className="border-b border-slate-700 px-6 py-4">
                <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email du compte
                </Text>
                <Link
                  href={`mailto:${userInfo.email}`}
                  className="mt-1 block text-base font-semibold text-brand-light no-underline"
                >
                  {userInfo.email}
                </Link>
              </td>
            </tr>
            <tr>
              <td className="border-b border-slate-700 px-6 py-4">
                <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Téléphone
                </Text>
                <Text className="m-0 mt-1 text-base text-white">
                  {userInfo.phone ?? 'Non renseigné'}
                </Text>
              </td>
            </tr>
            <tr>
              <td className="border-b border-slate-700 px-6 py-4">
                <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Solde crédits
                </Text>
                <Text className="m-0 mt-1 text-lg font-bold text-emerald-400">
                  {formatCentsToEuros(userInfo.balanceCents)}
                </Text>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4">
                <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Membre depuis
                </Text>
                <Text className="m-0 mt-1 text-base text-slate-300">
                  {formatDateFr(userInfo.createdAt)}
                </Text>
              </td>
            </tr>
          </table>
          {userInfo.upcomingBookings.length > 0 ? (
            <>
              <table cellPadding="0" cellSpacing="0" width="100%">
                <tr>
                  <td className="bg-slate-700 px-6 py-3">
                    <Text className="m-0 text-sm font-semibold text-white">
                      📅 Réservations à venir (
                      {userInfo.upcomingBookings.length})
                    </Text>
                  </td>
                </tr>
              </table>
              <table cellPadding="0" cellSpacing="0" width="100%">
                {userInfo.upcomingBookings.map((booking) => {
                  return (
                    <tr key={booking.id}>
                      <td className="border-b border-slate-700 px-6 py-3">
                        <Text className="m-0 text-sm font-semibold text-white">
                          {booking.courtName}
                        </Text>
                        <Text className="m-0 mt-1 text-sm text-slate-300">
                          {formatDateFr(booking.startAt)} à{' '}
                          {formatTimeFr(booking.startAt)} •{' '}
                          {formatCentsToEuros(booking.price)}
                        </Text>
                      </td>
                    </tr>
                  )
                })}
              </table>
            </>
          ) : null}
          {userInfo.recentBookings.length > 0 ? (
            <>
              <table cellPadding="0" cellSpacing="0" width="100%">
                <tr>
                  <td className="bg-slate-700 px-6 py-3">
                    <Text className="m-0 text-sm font-semibold text-white">
                      📜 Historique récent ({userInfo.recentBookings.length})
                    </Text>
                  </td>
                </tr>
              </table>
              <table cellPadding="0" cellSpacing="0" width="100%">
                {userInfo.recentBookings.map((booking) => {
                  return (
                    <tr key={booking.id}>
                      <td className="border-b border-slate-700 px-6 py-3">
                        <Text className="m-0 text-sm text-white">
                          {booking.courtName} • {formatDateFr(booking.startAt)}{' '}
                          • {formatCentsToEuros(booking.price)}
                        </Text>
                        <Text className="m-0 mt-1 text-xs text-slate-400">
                          {BOOKING_STATUS_LABELS[booking.status] ??
                            booking.status}
                          {booking.paymentType
                            ? ` • ${BOOKING_PAYMENT_TYPE_LABELS[booking.paymentType] ?? booking.paymentType}`
                            : null}
                        </Text>
                      </td>
                    </tr>
                  )
                })}
              </table>
            </>
          ) : null}
        </Section>
      ) : (
        <Section className="mt-8 rounded-lg bg-slate-700/50 p-4 text-center">
          <Text className="m-0 text-sm text-slate-400">
            ℹ️ Utilisateur non connecté lors de l&apos;envoi du message
          </Text>
        </Section>
      )}
    </EmailLayout>
  )
}

export default ContactEmail
