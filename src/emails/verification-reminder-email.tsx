import { SITE_URL } from '@/constants/app'
import { Button, Section, Text } from '@react-email/components'
import { EmailLayout } from './email-layout'

type VerificationReminderEmailProps = {
  firstName: string
  verificationUrl: string
}

export const VerificationReminderEmail = ({
  firstName = 'Marie',
  verificationUrl = `${SITE_URL}/auth/verify?token=abc123`
}: VerificationReminderEmailProps) => {
  return (
    <EmailLayout preview="Rappel : Confirmez votre adresse email - Pasio Padel Club">
      <Text className="m-0 text-xl font-semibold text-white">
        Bonjour {firstName} !
      </Text>
      <Text className="mt-4 text-base leading-7 text-slate-300">
        Nous avons remarqué que vous n&apos;avez pas encore confirmé votre
        adresse email sur Pasio Padel Club.
      </Text>
      <Text className="mt-4 text-base leading-7 text-slate-300">
        Pour pouvoir réserver un terrain et profiter pleinement de nos services,
        veuillez confirmer votre adresse email en cliquant sur le bouton
        ci-dessous.
      </Text>
      <Section className="my-8 text-center">
        <Button
          href={verificationUrl}
          className="inline-block rounded-lg bg-brand-light px-8 py-4 text-center text-base font-semibold text-slate-900 no-underline"
        >
          Confirmer mon email
        </Button>
      </Section>
      <Section className="rounded-lg bg-slate-700/50 p-4">
        <Text className="m-0 text-sm leading-6 text-amber-300">
          Important : Si vous ne confirmez pas votre email dans les 30 jours
          suivant votre inscription, votre compte sera automatiquement supprimé.
        </Text>
      </Section>
      <Text className="mt-6 text-sm leading-6 text-slate-400">
        Si vous n&apos;avez pas créé de compte sur Pasio Padel Club, vous pouvez
        ignorer cet email.
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

export default VerificationReminderEmail
