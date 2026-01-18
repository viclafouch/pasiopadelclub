import { Button, Section, Text } from '@react-email/components'
import { EmailLayout } from './email-layout'

type VerificationEmailProps = {
  firstName: string
  verificationUrl: string
}

export const VerificationEmail = ({
  firstName = 'Marie',
  verificationUrl = 'https://pasiopadelclub.fr/auth/verify?token=abc123'
}: VerificationEmailProps) => {
  return (
    <EmailLayout preview="Confirmez votre adresse email - Pasio Padel Club">
      <Text className="m-0 text-xl font-semibold text-white">
        Bienvenue {firstName} !
      </Text>
      <Text className="mt-4 text-base leading-7 text-slate-300">
        Merci de vous être inscrit sur Pasio Padel Club. Pour activer votre
        compte et commencer à réserver vos créneaux, veuillez confirmer votre
        adresse email.
      </Text>
      <Section className="my-8 text-center">
        <Button
          href={verificationUrl}
          className="inline-block rounded-lg bg-brand-light px-8 py-4 text-center text-base font-semibold text-slate-900 no-underline"
        >
          Confirmer mon email
        </Button>
      </Section>
      <Text className="text-sm leading-6 text-slate-400">
        Ce lien expire dans 24 heures. Si vous n&apos;avez pas créé de compte
        sur Pasio Padel Club, vous pouvez ignorer cet email.
      </Text>
      <Section className="mt-8 border-t border-slate-700 pt-6">
        <Text className="m-0 text-xs text-slate-500">
          Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
        </Text>
        <Text className="m-0 mt-2 break-all text-xs text-brand-light">
          {verificationUrl}
        </Text>
      </Section>
    </EmailLayout>
  )
}

export default VerificationEmail
