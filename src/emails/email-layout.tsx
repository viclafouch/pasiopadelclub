import { CLUB_INFO, SITE_URL } from '@/constants/app'
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components'

type EmailLayoutProps = {
  preview: string
  children: React.ReactNode
  baseUrl?: string
}

export const EmailLayout = ({
  preview,
  children,
  baseUrl = SITE_URL
}: EmailLayoutProps) => {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
      </Head>
      <Preview>{preview}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#1a6b5a',
                'brand-light': '#4ec990',
                'brand-bg': '#f0fdf9'
              }
            }
          }
        }}
      >
        <Body className="m-0 bg-slate-800 p-0 font-sans">
          <Container className="mx-auto max-w-xl bg-slate-800">
            <Section className="bg-brand px-8 py-4 text-center">
              <Text className="m-0 text-xl font-bold tracking-tight text-white">
                PASIO{' '}
                <span className="font-medium text-brand-light">PADEL CLUB</span>
              </Text>
            </Section>
            <Section className="px-8 py-10">{children}</Section>
            <Section className="border-t border-slate-700 px-8 py-6">
              <Text className="m-0 text-center text-xs leading-5 text-slate-400">
                {CLUB_INFO.name}
                <br />
                {CLUB_INFO.address.full}
              </Text>
              <Text className="m-0 mt-2 text-center text-xs text-slate-500">
                <Link
                  href={CLUB_INFO.phone.href}
                  className="text-slate-400 no-underline"
                >
                  {CLUB_INFO.phone.display}
                </Link>
                {' • '}
                <Link
                  href={`mailto:${CLUB_INFO.email}`}
                  className="text-slate-400 no-underline"
                >
                  {CLUB_INFO.email}
                </Link>
              </Text>
              <Text className="m-0 mt-2 text-center text-xs text-slate-500">
                <Link href={baseUrl} className="text-brand-light underline">
                  {baseUrl.replace('https://', '')}
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
