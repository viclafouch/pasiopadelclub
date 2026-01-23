import { SITE_URL } from '@/constants/app'
import { Button, Column, Row, Section, Text } from '@react-email/components'
import { EmailLayout } from './email-layout'

type ResetPasswordEmailProps = {
  firstName: string
  resetUrl: string
}

export const ResetPasswordEmail = ({
  firstName = 'Marie',
  resetUrl = `${SITE_URL}/reinitialiser-mot-de-passe?token=abc123`
}: ResetPasswordEmailProps) => {
  return (
    <EmailLayout preview="Réinitialisez votre mot de passe - Pasio Padel Club">
      <Text className="m-0 text-xl font-semibold text-white">
        Bonjour {firstName},
      </Text>
      <Text className="mt-4 text-base leading-7 text-slate-300">
        Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le
        bouton ci-dessous pour choisir un nouveau mot de passe.
      </Text>
      <Section className="my-8 text-center">
        <Button
          href={resetUrl}
          className="inline-block rounded-lg bg-brand-light px-8 py-4 text-center text-base font-semibold text-slate-900 no-underline"
        >
          Réinitialiser mon mot de passe
        </Button>
      </Section>
      <Text className="text-sm leading-6 text-slate-400">
        Ce lien expire dans 1 heure. Si vous n&apos;avez pas demandé cette
        réinitialisation, vous pouvez ignorer cet email. Votre mot de passe
        restera inchangé.
      </Text>
      <Section className="mt-8 border-t border-slate-700 pt-6">
        <Text className="m-0 text-xs text-slate-500">
          Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
        </Text>
        <Row>
          <Column
            style={{
              tableLayout: 'fixed',
              width: '100%',
              maxWidth: '1px',
              wordBreak: 'break-all',
              overflowWrap: 'break-word'
            }}
          >
            <Text className="m-0 mt-2 text-xs text-brand-light">
              {resetUrl}
            </Text>
          </Column>
        </Row>
      </Section>
    </EmailLayout>
  )
}

export default ResetPasswordEmail
