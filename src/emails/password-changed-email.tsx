import { CLUB_INFO } from '@/constants/app'
import { Section, Text } from '@react-email/components'
import { EmailLayout } from './email-layout'

type PasswordChangedEmailProps = {
  firstName: string
  changeDate: string
}

export const PasswordChangedEmail = ({
  firstName,
  changeDate
}: PasswordChangedEmailProps) => {
  return (
    <EmailLayout preview="Votre mot de passe a été modifié - Pasio Padel Club">
      <Text className="m-0 text-xl font-semibold text-white">
        Bonjour {firstName},
      </Text>
      <Text className="mt-4 text-base leading-7 text-slate-300">
        Votre mot de passe a été modifié avec succès le {changeDate}.
      </Text>
      <Text className="mt-4 text-base leading-7 text-slate-300">
        Si vous êtes à l&apos;origine de cette modification, vous pouvez ignorer
        cet email.
      </Text>
      <Section className="mt-8 rounded-lg border border-red-500/30 bg-red-950/50 p-6">
        <Text className="m-0 text-base font-semibold text-red-200">
          Vous n&apos;avez pas demandé ce changement ?
        </Text>
        <Text className="mt-2 text-sm leading-6 text-red-300">
          Si vous n&apos;êtes pas à l&apos;origine de cette modification, votre
          compte a peut-être été compromis. Contactez-nous immédiatement à{' '}
          {CLUB_INFO.email} ou au {CLUB_INFO.phone.display}.
        </Text>
      </Section>
    </EmailLayout>
  )
}
