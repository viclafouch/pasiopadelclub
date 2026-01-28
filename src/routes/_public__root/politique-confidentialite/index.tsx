/* eslint-disable max-lines-per-function */
import { CLUB_INFO } from '@/constants/app'
import { seo } from '@/utils/seo'
import { createFileRoute, Link } from '@tanstack/react-router'

type LegalSectionProps = {
  title: string
  children: React.ReactNode
}

const LegalSection = ({ title, children }: LegalSectionProps) => {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-bold text-foreground">
        {title}
      </h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  )
}

const PolitiqueConfidentialitePage = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="section-py relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Politique de confidentialité
            </h1>
            <p className="text-muted-foreground">
              Dernière mise à jour : Janvier 2025
            </p>
          </div>
        </div>
      </section>
      <section className="section-pb">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-10">
            <LegalSection title="1. Introduction">
              <p>
                {CLUB_INFO.name} s&apos;engage à protéger la vie privée des
                utilisateurs de son site web et de ses services. Cette politique
                de confidentialité explique comment nous collectons, utilisons
                et protégeons vos données personnelles.
              </p>
              <p>
                En utilisant notre site et nos services, vous acceptez les
                pratiques décrites dans cette politique.
              </p>
            </LegalSection>
            <LegalSection title="2. Données collectées">
              <p>Nous collectons les données suivantes :</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>Données d&apos;identification</strong> : nom, prénom,
                  adresse email, numéro de téléphone
                </li>
                <li>
                  <strong>Données de réservation</strong> : historique des
                  réservations, préférences de courts
                </li>
                <li>
                  <strong>Données de paiement</strong> : les paiements sont
                  traités par Stripe, nous ne stockons pas vos données bancaires
                </li>
                <li>
                  <strong>Données de connexion</strong> : adresse IP, type de
                  navigateur, pages visitées
                </li>
              </ul>
            </LegalSection>
            <LegalSection title="3. Finalités du traitement">
              <p>Vos données sont utilisées pour :</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Gérer votre compte et vos réservations</li>
                <li>Traiter les paiements de manière sécurisée</li>
                <li>Vous envoyer des confirmations et rappels par email</li>
                <li>Répondre à vos demandes de contact</li>
                <li>Améliorer nos services et votre expérience</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </LegalSection>
            <LegalSection title="4. Base légale du traitement">
              <p>Le traitement de vos données repose sur :</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>L&apos;exécution du contrat</strong> : pour gérer vos
                  réservations et paiements
                </li>
                <li>
                  <strong>Votre consentement</strong> : pour l&apos;envoi de
                  communications marketing
                </li>
                <li>
                  <strong>L&apos;intérêt légitime</strong> : pour améliorer nos
                  services
                </li>
                <li>
                  <strong>Les obligations légales</strong> : pour la
                  conservation des données de facturation
                </li>
              </ul>
            </LegalSection>
            <LegalSection title="5. Destinataires des données">
              <p>Vos données peuvent être partagées avec :</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>Stripe</strong> : pour le traitement sécurisé des
                  paiements
                </li>
                <li>
                  <strong>Resend</strong> : pour l&apos;envoi des emails
                  transactionnels
                </li>
                <li>
                  <strong>Railway</strong> : hébergeur de notre application
                </li>
                <li>
                  <strong>Neon</strong> : hébergeur de notre base de données
                </li>
              </ul>
              <p>
                Ces prestataires sont conformes au RGPD ou disposent de clauses
                contractuelles types pour les transferts de données.
              </p>
            </LegalSection>
            <LegalSection title="6. Durée de conservation">
              <p>Vos données sont conservées pendant :</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>Données de compte</strong> : tant que votre compte est
                  actif, puis 3 ans après la dernière activité
                </li>
                <li>
                  <strong>Données de réservation</strong> : 3 ans à compter de
                  la réservation
                </li>
                <li>
                  <strong>Données de facturation</strong> : 10 ans (obligation
                  légale)
                </li>
                <li>
                  <strong>Cookies</strong> : 13 mois maximum
                </li>
              </ul>
            </LegalSection>
            <LegalSection title="7. Vos droits">
              <p>
                Conformément au RGPD, vous disposez des droits suivants sur vos
                données :
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>Droit de rectification</strong> : vous pouvez modifier
                  vos informations depuis votre espace &quot;Mon compte&quot;
                </li>
                <li>
                  <strong>Droit à l&apos;effacement</strong> : vous pouvez
                  supprimer votre compte depuis votre espace &quot;Mon
                  compte&quot;
                </li>
                <li>
                  <strong>Droit d&apos;accès et portabilité</strong> : vous
                  pouvez télécharger vos données au format JSON depuis votre
                  espace &quot;Mon compte&quot;
                </li>
                <li>
                  <strong>Droit d&apos;opposition</strong> : vous opposer au
                  traitement de vos données
                </li>
              </ul>
              <p>
                Pour toute autre demande, utilisez notre{' '}
                <Link to="/contact" className="text-primary hover:underline">
                  formulaire de contact
                </Link>
                . Nous répondrons dans un délai d&apos;un mois.
              </p>
            </LegalSection>
            <LegalSection title="8. Sécurité des données">
              <p>
                Nous mettons en œuvre des mesures techniques et
                organisationnelles appropriées pour protéger vos données :
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Chiffrement SSL/TLS pour toutes les communications</li>
                <li>
                  Paiements sécurisés via Stripe (certifié PCI-DSS niveau 1)
                </li>
                <li>Accès restreint aux données personnelles</li>
                <li>Mots de passe chiffrés de manière irréversible</li>
              </ul>
            </LegalSection>
            <LegalSection title="9. Cookies">
              <p>
                Notre site utilise des cookies essentiels au fonctionnement du
                service :
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>Cookies de session</strong> : pour maintenir votre
                  connexion
                </li>
                <li>
                  <strong>Cookies de préférence</strong> : pour mémoriser vos
                  choix
                </li>
              </ul>
              <p>
                Nous n&apos;utilisons pas de cookies publicitaires ni de
                tracking tiers.
              </p>
            </LegalSection>
            <LegalSection title="10. Modifications">
              <p>
                Cette politique peut être mise à jour. En cas de modification
                substantielle, nous vous en informerons par email ou via une
                notification sur le site.
              </p>
            </LegalSection>
            <LegalSection title="11. Contact">
              <p>
                Pour toute question concernant cette politique ou vos données
                personnelles, utilisez notre{' '}
                <Link to="/contact" className="text-primary hover:underline">
                  formulaire de contact
                </Link>{' '}
                ou contactez-nous directement :
              </p>
              <div className="space-y-1">
                <p>
                  <strong>Téléphone :</strong>{' '}
                  <a
                    href={CLUB_INFO.phone.href}
                    className="text-primary hover:underline"
                  >
                    {CLUB_INFO.phone.display}
                  </a>
                </p>
                <p>
                  <strong>Adresse :</strong> {CLUB_INFO.address.full}
                </p>
              </div>
              <p>
                Vous pouvez également introduire une réclamation auprès de la
                CNIL :{' '}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  www.cnil.fr
                </a>
              </p>
            </LegalSection>
            <div className="rounded-xl border border-border/50 bg-card/50 p-6">
              <p className="text-sm text-muted-foreground">
                Voir aussi :{' '}
                <Link to="/cgv" className="text-primary hover:underline">
                  Conditions Générales de Vente
                </Link>{' '}
                |{' '}
                <Link
                  to="/mentions-legales"
                  className="text-primary hover:underline"
                >
                  Mentions légales
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export const Route = createFileRoute(
  '/_public__root/politique-confidentialite/'
)({
  component: PolitiqueConfidentialitePage,
  staleTime: Infinity,
  head: () => {
    return seo({
      title: 'Politique de confidentialité',
      description: `Politique de confidentialité de ${CLUB_INFO.name}. Comment nous collectons, utilisons et protégeons vos données personnelles (RGPD).`,
      pathname: '/politique-confidentialite'
    })
  }
})
