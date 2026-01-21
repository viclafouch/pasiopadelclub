import { SITE_URL } from '@/constants/app'
import { Button, Section, Text } from '@react-email/components'
import { EmailLayout } from './email-layout'

type BookingCancellationEmailProps = {
  firstName: string
  courtName: string
  date: string
  startTime: string
  price: string
  baseUrl?: string
}

export const BookingCancellationEmail = ({
  firstName = 'Marie',
  courtName = 'Court N°2',
  date = 'Vendredi 24 janvier 2025',
  startTime = '18:30',
  price = '60 €',
  baseUrl = SITE_URL
}: BookingCancellationEmailProps) => {
  return (
    <EmailLayout
      preview={`Annulation confirmée - ${courtName} le ${date}`}
      baseUrl={baseUrl}
    >
      <Section className="mb-6 rounded-lg bg-slate-700 p-6 text-center">
        <Text className="m-0 text-4xl">📭</Text>
        <Text className="m-0 mt-2 text-lg font-semibold text-slate-300">
          Réservation annulée
        </Text>
      </Section>
      <Text className="m-0 text-xl font-semibold text-white">
        {firstName}, votre annulation est confirmée
      </Text>
      <Text className="mt-4 text-base leading-7 text-slate-300">
        Votre réservation a bien été annulée. Le remboursement sera effectué
        dans les prochains jours.
      </Text>
      <Section className="my-8 overflow-hidden rounded-lg border border-slate-700">
        <table cellPadding="0" cellSpacing="0" width="100%">
          <tr>
            <td className="bg-slate-700 p-4">
              <Text className="m-0 text-center text-sm font-semibold uppercase tracking-wide text-slate-300">
                Réservation annulée
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
              <Text className="m-0 mt-1 text-base text-slate-400 line-through">
                {courtName}
              </Text>
            </td>
          </tr>
          <tr>
            <td className="border-b border-slate-700 px-6 py-4">
              <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                Date prévue
              </Text>
              <Text className="m-0 mt-1 text-base text-slate-400 line-through">
                {date} à {startTime}
              </Text>
            </td>
          </tr>
        </table>
      </Section>
      <Section className="overflow-hidden rounded-lg border-2 border-brand-light bg-brand">
        <table cellPadding="0" cellSpacing="0" width="100%">
          <tr>
            <td className="p-6 text-center">
              <Text className="m-0 text-sm font-medium uppercase tracking-wide text-brand-light">
                Remboursement
              </Text>
              <Text className="m-0 mt-2 text-3xl font-bold text-white">
                {price}
              </Text>
              <Text className="m-0 mt-2 text-sm text-slate-300">
                Le montant sera crédité sous 5 à 10 jours ouvrés
              </Text>
            </td>
          </tr>
        </table>
      </Section>
      <Section className="mt-8 text-center">
        <Button
          href={`${baseUrl}/reservation`}
          className="inline-block rounded-lg bg-brand-light px-8 py-4 text-center text-base font-semibold text-slate-900 no-underline"
        >
          Réserver un autre créneau
        </Button>
      </Section>
      <Text className="mt-8 text-center text-sm text-slate-400">
        Nous espérons vous revoir bientôt sur nos terrains !
      </Text>
    </EmailLayout>
  )
}

export default BookingCancellationEmail
