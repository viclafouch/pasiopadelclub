import { SITE_URL } from '@/constants/app'
import { Button, Section, Text } from '@react-email/components'
import { EmailLayout } from './email-layout'

type CreditPackPurchaseEmailProps = {
  firstName: string
  packName: string
  creditsAmount: string
  totalPaid: string
  expiresAt: string
  baseUrl?: string
}

export const CreditPackPurchaseEmail = ({
  firstName,
  packName,
  creditsAmount,
  totalPaid,
  expiresAt,
  baseUrl = SITE_URL
}: CreditPackPurchaseEmailProps) => {
  return (
    <EmailLayout preview={`Achat confirmé - ${packName}`} baseUrl={baseUrl}>
      <Section className="mb-6 rounded-lg bg-brand p-6 text-center">
        <Text className="m-0 text-4xl">💳</Text>
        <Text className="m-0 mt-2 text-lg font-semibold text-white">
          Achat confirmé
        </Text>
      </Section>
      <Text className="m-0 text-xl font-semibold text-white">
        Merci {firstName} !
      </Text>
      <Text className="mt-4 text-base leading-7 text-slate-300">
        Votre achat de crédits a bien été effectué. Vos crédits sont
        immédiatement disponibles pour réserver vos terrains.
      </Text>
      <Section className="my-8 overflow-hidden rounded-lg border border-slate-700">
        <table cellPadding="0" cellSpacing="0" width="100%">
          <tr>
            <td className="bg-brand p-4">
              <Text className="m-0 text-center text-sm font-semibold uppercase tracking-wide text-white">
                Détails de l&apos;achat
              </Text>
            </td>
          </tr>
        </table>
        <table cellPadding="0" cellSpacing="0" width="100%" className="p-6">
          <tr>
            <td className="border-b border-slate-700 px-6 py-4">
              <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                Pack
              </Text>
              <Text className="m-0 mt-1 text-base font-semibold text-white">
                {packName}
              </Text>
            </td>
          </tr>
          <tr>
            <td className="border-b border-slate-700 px-6 py-4">
              <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                Crédits ajoutés
              </Text>
              <Text className="m-0 mt-1 text-base font-semibold text-brand-light">
                {creditsAmount}
              </Text>
            </td>
          </tr>
          <tr>
            <td className="border-b border-slate-700 px-6 py-4">
              <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                Montant payé
              </Text>
              <Text className="m-0 mt-1 text-base font-semibold text-white">
                {totalPaid}
              </Text>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4">
              <Text className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                Validité
              </Text>
              <Text className="m-0 mt-1 text-base text-white">
                Jusqu&apos;au {expiresAt}
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
          Réserver un terrain
        </Button>
      </Section>
      <Text className="mt-8 text-center text-sm text-slate-400">
        Vos crédits sont utilisables pour toutes vos réservations.
      </Text>
    </EmailLayout>
  )
}

export default CreditPackPurchaseEmail
