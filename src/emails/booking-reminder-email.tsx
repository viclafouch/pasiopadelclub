import { CLUB_INFO } from '@/constants/app'
import { Button, Section, Text } from '@react-email/components'
import { EmailLayout } from './email-layout'

type BookingReminderEmailProps = {
  firstName: string
  courtName: string
  date: string
  startTime: string
  endTime: string
}

export const BookingReminderEmail = ({
  firstName = 'Marie',
  courtName = 'Court N°1',
  date = 'Dimanche 26 janvier 2025',
  startTime = '10:00',
  endTime = '11:30'
}: BookingReminderEmailProps) => {
  return (
    <EmailLayout preview={`Rappel : ${courtName} demain à ${startTime}`}>
      <Section className="mb-6 rounded-lg bg-brand p-6 text-center">
        <Text className="m-0 text-4xl">⏰</Text>
        <Text className="m-0 mt-2 text-lg font-semibold text-white">
          Rappel - J-1
        </Text>
      </Section>
      <Text className="m-0 text-xl font-semibold text-white">
        {firstName}, c&apos;est demain !
      </Text>
      <Text className="mt-4 text-base leading-7 text-slate-300">
        Nous vous rappelons votre réservation de terrain de padel prévue demain.
      </Text>
      <Section className="my-8 overflow-hidden rounded-lg border-2 border-brand-light bg-brand">
        <table cellPadding="0" cellSpacing="0" width="100%">
          <tr>
            <td className="p-6 text-center">
              <Text className="m-0 text-sm font-medium uppercase tracking-wide text-brand-light">
                {courtName}
              </Text>
              <Text className="m-0 mt-2 text-2xl font-bold text-white">
                {date}
              </Text>
              <Text className="m-0 mt-2 text-xl font-semibold text-brand-light">
                {startTime} - {endTime}
              </Text>
            </td>
          </tr>
        </table>
      </Section>
      <Section className="rounded-lg bg-slate-700 p-4">
        <Text className="m-0 text-sm font-semibold text-white">
          À ne pas oublier :
        </Text>
        <Text className="m-0 mt-2 text-sm leading-6 text-slate-300">
          ✓ Raquette de padel
        </Text>
        <Text className="m-0 mt-1 text-sm leading-6 text-slate-300">
          ✓ Chaussures de sport adaptées
        </Text>
        <Text className="m-0 mt-1 text-sm leading-6 text-slate-300">
          ✓ Tenue de sport confortable
        </Text>
        <Text className="m-0 mt-1 text-sm leading-6 text-slate-300">
          ✓ Bouteille d&apos;eau
        </Text>
      </Section>
      <Section className="mt-8 rounded-lg border border-slate-700 p-4">
        <Text className="m-0 text-sm leading-6 text-slate-300">
          📍 <strong>Adresse :</strong> {CLUB_INFO.address.full}
        </Text>
        <Text className="m-0 mt-2 text-sm leading-6 text-slate-300">
          ⏰ <strong>Arrivée :</strong> 10 minutes avant le créneau
        </Text>
      </Section>
      <Section className="mt-8 text-center">
        <Button
          href="https://pasiopadelclub.fr/mon-compte"
          className="inline-block rounded-lg bg-brand-light px-8 py-4 text-center text-base font-semibold text-slate-900 no-underline"
        >
          Gérer ma réservation
        </Button>
      </Section>
      <Text className="mt-8 text-center text-sm text-slate-400">
        Bon match ! 🎾
      </Text>
    </EmailLayout>
  )
}

export default BookingReminderEmail
