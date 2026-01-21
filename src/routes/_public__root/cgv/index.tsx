import { CLUB_INFO } from '@/constants/app'
import { seo } from '@/utils/seo'
import { createFileRoute } from '@tanstack/react-router'

type LegalSectionProps = {
  title: string
  children: React.ReactNode
}

const LegalSection = ({ title, children }: LegalSectionProps) => {
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-display text-xl font-bold text-foreground">
        {title}
      </h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  )
}

const CgvPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="section-py relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        <div className="container relative">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Conditions Générales de Vente
            </h1>
            <p className="mt-4 text-muted-foreground">
              Dernière mise à jour : Janvier 2025
            </p>
          </div>
        </div>
      </section>

      <section className="section-pb">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <LegalSection title="1. Objet">
              <p>
                Les présentes Conditions Générales de Vente (CGV) régissent les
                relations contractuelles entre {CLUB_INFO.name} et ses clients
                pour toute réservation de court de padel et services associés.
              </p>
              <p>
                En effectuant une réservation, le client reconnaît avoir pris
                connaissance et accepté sans réserve les présentes CGV.
              </p>
            </LegalSection>

            <LegalSection title="2. Services proposés">
              <p>{CLUB_INFO.name} propose les services suivants :</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>Court Double (90 min)</strong> : 60€ pour 4 joueurs
                  (15€/personne)
                </li>
                <li>
                  <strong>Court Simple (60 min)</strong> : 30€ pour 2 joueurs
                  (15€/personne)
                </li>
                <li>
                  <strong>Court Kids (60 min)</strong> : 15€ pour 2 joueurs
                  (7,50€/personne)
                </li>
                <li>Location de matériel (raquettes)</li>
                <li>Cours collectifs et particuliers</li>
              </ul>
            </LegalSection>

            <LegalSection title="3. Réservation">
              <p>
                Les réservations peuvent être effectuées via notre site
                internet, l&apos;application mobile &quot;{CLUB_INFO.name}&quot;
                ou par téléphone au{' '}
                <a
                  href={CLUB_INFO.phone.href}
                  className="text-primary hover:underline"
                >
                  {CLUB_INFO.phone.display}
                </a>
                .
              </p>
              <p>
                Toute réservation est ferme et définitive dès sa confirmation et
                le paiement effectué. Un email de confirmation est envoyé au
                client.
              </p>
              <p>
                Le club est ouvert {CLUB_INFO.hours.days.toLowerCase()} de{' '}
                {CLUB_INFO.hours.open}00 à {CLUB_INFO.hours.close}00.
              </p>
            </LegalSection>

            <LegalSection title="4. Tarifs et paiement">
              <p>
                Les tarifs sont indiqués en euros TTC et peuvent être modifiés à
                tout moment. Les tarifs applicables sont ceux en vigueur au
                moment de la réservation.
              </p>
              <p>
                Le paiement s&apos;effectue en ligne par carte bancaire au
                moment de la réservation. Le paiement sur place est également
                possible pour les réservations par téléphone.
              </p>
            </LegalSection>

            <LegalSection title="5. Annulation et remboursement">
              <p>
                <strong>Annulation par le client :</strong>
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  Annulation plus de 24 heures avant le créneau : remboursement
                  intégral
                </li>
                <li>
                  Annulation moins de 24 heures avant le créneau : aucun
                  remboursement
                </li>
                <li>En cas de non-présentation : aucun remboursement</li>
              </ul>
              <p className="mt-4">
                <strong>Annulation par {CLUB_INFO.name} :</strong>
              </p>
              <p>
                En cas d&apos;annulation de notre fait (problème technique,
                maintenance imprévue), le client sera intégralement remboursé ou
                pourra reporter sa réservation sans frais.
              </p>
            </LegalSection>

            <LegalSection title="6. Règles d'utilisation des courts">
              <p>Les joueurs s&apos;engagent à :</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Porter une tenue et des chaussures de sport adaptées</li>
                <li>Respecter les horaires de réservation</li>
                <li>Libérer le court à l&apos;heure prévue</li>
                <li>Respecter le matériel et les installations</li>
                <li>
                  Adopter un comportement respectueux envers les autres joueurs
                  et le personnel
                </li>
              </ul>
              <p className="mt-4">
                En cas de dégradation volontaire du matériel ou des
                installations, le client sera tenu responsable des réparations.
              </p>
            </LegalSection>

            <LegalSection title="7. Responsabilité">
              <p>
                {CLUB_INFO.name} met à disposition des installations conformes
                aux normes de sécurité en vigueur. Cependant, la pratique du
                padel se fait sous la responsabilité des joueurs.
              </p>
              <p>
                Nous recommandons fortement aux joueurs de souscrire une
                assurance personnelle couvrant la pratique sportive.
              </p>
              <p>
                {CLUB_INFO.name} décline toute responsabilité en cas de vol ou
                de perte d&apos;objets personnels dans l&apos;enceinte du club.
              </p>
            </LegalSection>

            <LegalSection title="8. Données personnelles">
              <p>
                Les données personnelles collectées lors de la réservation sont
                traitées conformément à notre politique de confidentialité et au
                RGPD. Elles sont utilisées uniquement pour la gestion des
                réservations et la communication avec nos clients.
              </p>
              <p>
                Pour plus d&apos;informations, consultez nos{' '}
                <a
                  href="/mentions-legales"
                  className="text-primary hover:underline"
                >
                  mentions légales
                </a>
                .
              </p>
            </LegalSection>

            <LegalSection title="9. Réclamations">
              <p>
                Pour toute réclamation, le client peut contacter{' '}
                {CLUB_INFO.name} par email à{' '}
                <a
                  href={`mailto:${CLUB_INFO.email}`}
                  className="text-primary hover:underline"
                >
                  {CLUB_INFO.email}
                </a>{' '}
                ou par téléphone au{' '}
                <a
                  href={CLUB_INFO.phone.href}
                  className="text-primary hover:underline"
                >
                  {CLUB_INFO.phone.display}
                </a>
                .
              </p>
              <p>
                Nous nous engageons à traiter toute réclamation dans un délai de
                48 heures ouvrées.
              </p>
            </LegalSection>

            <LegalSection title="10. Droit applicable et litiges">
              <p>
                Les présentes CGV sont soumises au droit français. En cas de
                litige, une solution amiable sera recherchée avant toute action
                judiciaire.
              </p>
              <p>
                À défaut d&apos;accord amiable, les tribunaux compétents seront
                ceux du ressort du siège social de {CLUB_INFO.name}.
              </p>
            </LegalSection>

            <div className="mt-12 rounded-xl border border-border/50 bg-card/50 p-6">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{CLUB_INFO.name}</strong>
                <br />
                {CLUB_INFO.address.full}
                <br />
                Téléphone :{' '}
                <a
                  href={CLUB_INFO.phone.href}
                  className="text-primary hover:underline"
                >
                  {CLUB_INFO.phone.display}
                </a>
                <br />
                Email :{' '}
                <a
                  href={`mailto:${CLUB_INFO.email}`}
                  className="text-primary hover:underline"
                >
                  {CLUB_INFO.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export const Route = createFileRoute('/_public__root/cgv/')({
  component: CgvPage,
  head: () => {
    return {
      meta: seo({
        title: 'Conditions Générales de Vente',
        description: `Conditions Générales de Vente de ${CLUB_INFO.name} à ${CLUB_INFO.address.city}. Tarifs, réservation, annulation et règles d'utilisation des courts de padel.`,
        pathname: '/cgv'
      })
    }
  }
})
