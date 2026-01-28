import { SITE_URL } from '@/constants/app'
import { Button, Section, Text } from '@react-email/components'
import { EmailLayout } from './email-layout'

type WelcomeEmailProps = {
  firstName: string
  baseUrl?: string
}

export const WelcomeEmail = ({
  firstName,
  baseUrl = SITE_URL
}: WelcomeEmailProps) => {
  return (
    <EmailLayout
      preview="Votre compte est prêt - Pasio Padel Club"
      baseUrl={baseUrl}
    >
      <Section className="mb-6 rounded-lg bg-brand p-6 text-center">
        <Text className="m-0 text-4xl">🎾</Text>
        <Text className="m-0 mt-2 text-lg font-semibold text-white">
          Compte activé !
        </Text>
      </Section>
      <Text className="m-0 text-xl font-semibold text-white">
        Bienvenue dans le club, {firstName} !
      </Text>
      <Text className="mt-4 text-base leading-7 text-slate-300">
        Votre compte Pasio Padel Club est maintenant actif. Vous pouvez dès à
        présent réserver vos créneaux sur nos terrains.
      </Text>
      <Section className="my-8 rounded-lg border border-slate-700 p-6">
        <Text className="m-0 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Ce que vous pouvez faire
        </Text>
        <table cellPadding="0" cellSpacing="0" width="100%">
          <tr>
            <td className="py-3 pr-4 align-top">
              <Text className="m-0 text-xl">📅</Text>
            </td>
            <td className="py-3">
              <Text className="m-0 text-sm font-medium text-white">
                Réserver un terrain
              </Text>
              <Text className="m-0 mt-1 text-xs text-slate-400">
                7 terrains disponibles, jusqu&apos;à 10 jours à l&apos;avance
              </Text>
            </td>
          </tr>
          <tr>
            <td className="py-3 pr-4 align-top">
              <Text className="m-0 text-xl">💳</Text>
            </td>
            <td className="py-3">
              <Text className="m-0 text-sm font-medium text-white">
                Acheter des crédits
              </Text>
              <Text className="m-0 mt-1 text-xs text-slate-400">
                Économisez avec nos packs de crédits prépayés
              </Text>
            </td>
          </tr>
          <tr>
            <td className="py-3 pr-4 align-top">
              <Text className="m-0 text-xl">📱</Text>
            </td>
            <td className="py-3">
              <Text className="m-0 text-sm font-medium text-white">
                Gérer vos réservations
              </Text>
              <Text className="m-0 mt-1 text-xs text-slate-400">
                Consultez et annulez vos réservations en ligne
              </Text>
            </td>
          </tr>
        </table>
      </Section>
      <Section className="text-center">
        <Button
          href={`${baseUrl}/reservation`}
          className="inline-block rounded-lg bg-brand-light px-8 py-4 text-center text-base font-semibold text-slate-900 no-underline"
        >
          Réserver un terrain
        </Button>
      </Section>
      <Text className="mt-8 text-center text-sm text-slate-400">
        À très bientôt sur les terrains !
      </Text>
    </EmailLayout>
  )
}

export default WelcomeEmail
