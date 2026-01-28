import { CLUB_INFO, SITE_URL } from '@/constants/app'
import { Button, Section, Text } from '@react-email/components'
import { EmailLayout } from './email-layout'

type BookingConfirmationEmailProps = {
  firstName: string
  courtName: string
  date: string
  startTime: string
  endTime: string
  price: string
  baseUrl?: string
}

export const BookingConfirmationEmail = ({
  firstName,
  courtName,
  date,
  startTime,
  endTime,
  price,
  baseUrl = SITE_URL
}: BookingConfirmationEmailProps) => {
  return (
    <EmailLayout
      preview={`Réservation confirmée - ${courtName} le ${date}`}
      baseUrl={baseUrl}
    >
      <Section className="mb-6 rounded-lg bg-brand p-6 text-center">
        <Text className="m-0 text-4xl">✅</Text>
        <Text className="m-0 mt-2 text-lg font-semibold text-white">
          Réservation confirmée
        </Text>
      </Section>
      <Text className="m-0 text-xl font-semibold text-white">
        Parfait {firstName} !
      </Text>
      <Text className="mt-4 text-base leading-7 text-slate-300">
        Votre réservation est confirmée. Retrouvez les détails ci-dessous.
      </Text>
      <Section className="my-8 overflow-hidden rounded-lg border border-slate-700">
        <table cellPadding="0" cellSpacing="0" width="100%">
          <tr>
            <td className="bg-brand p-4">
              <Text className="m-0 text-center text-sm font-semibold uppercase tracking-wide text-white">
                Détails de la réservation
              </Text>
            </td>
          </tr>
        </table>
        <table cellPadding="0" cellSpacing="0" width="100%" className="p-6">
          <tr>
            <td className="border-b border-slate-700 px-6 py-4">
              <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                Terrain
              </Text>
              <Text className="m-0 mt-1 text-base font-semibold text-white">
                {courtName}
              </Text>
            </td>
          </tr>
          <tr>
            <td className="border-b border-slate-700 px-6 py-4">
              <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                Date
              </Text>
              <Text className="m-0 mt-1 text-base font-semibold text-white">
                {date}
              </Text>
            </td>
          </tr>
          <tr>
            <td className="border-b border-slate-700 px-6 py-4">
              <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                Horaire
              </Text>
              <Text className="m-0 mt-1 text-base font-semibold text-white">
                {startTime} - {endTime}
              </Text>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4">
              <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                Montant payé
              </Text>
              <Text className="m-0 mt-1 text-xl font-bold text-brand-light">
                {price}
              </Text>
            </td>
          </tr>
        </table>
      </Section>
      <Section className="rounded-lg bg-slate-700 p-4">
        <Text className="m-0 text-sm leading-6 text-slate-300">
          📍 <strong>Adresse :</strong> {CLUB_INFO.address.full}
        </Text>
        <Text className="m-0 mt-2 text-sm leading-6 text-slate-300">
          ⏰ <strong>Rappel :</strong> Présentez-vous 10 minutes avant votre
          créneau
        </Text>
      </Section>
      <Section className="mt-8 text-center">
        <Button
          href={`${baseUrl}/mon-compte`}
          className="inline-block rounded-lg bg-brand-light px-8 py-4 text-center text-base font-semibold text-slate-900 no-underline"
        >
          Voir mes réservations
        </Button>
      </Section>
      <Text className="mt-8 text-center text-sm text-slate-400">
        Vous pouvez annuler gratuitement jusqu&apos;à 24h avant le créneau.
      </Text>
    </EmailLayout>
  )
}

export default BookingConfirmationEmail
