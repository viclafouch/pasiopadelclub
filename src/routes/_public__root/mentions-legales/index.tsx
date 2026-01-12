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

const MentionsLegalesPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />

        <div className="container relative">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Mentions légales
            </h1>
            <p className="mt-4 text-muted-foreground">
              Dernière mise à jour : Janvier 2025
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <LegalSection title="1. Éditeur du site">
              <p>
                Le présent site est édité par <strong>Pasio Padel Club</strong>.
              </p>
              <p>
                <strong>Adresse :</strong> 20 rue Alfred de Vigny, 64600 Anglet,
                France
              </p>
              <p>
                <strong>Téléphone :</strong>{' '}
                <a
                  href="tel:+33971117928"
                  className="text-primary hover:underline"
                >
                  09 71 11 79 28
                </a>
              </p>
              <p>
                <strong>Email :</strong>{' '}
                <a
                  href="mailto:contact@pasiopadelclub.fr"
                  className="text-primary hover:underline"
                >
                  contact@pasiopadelclub.fr
                </a>
              </p>
            </LegalSection>

            <LegalSection title="2. Directeur de la publication">
              <p>
                Le directeur de la publication est le représentant légal de
                Pasio Padel Club.
              </p>
            </LegalSection>

            <LegalSection title="3. Hébergement">
              <p>
                Le site est hébergé par <strong>Vercel Inc.</strong>
              </p>
              <p>
                <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA
                91789, États-Unis
              </p>
              <p>
                <strong>Site web :</strong>{' '}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  vercel.com
                </a>
              </p>
            </LegalSection>

            <LegalSection title="4. Propriété intellectuelle">
              <p>
                L&apos;ensemble du contenu du site (textes, images, vidéos,
                logos, graphismes, icônes, etc.) est la propriété exclusive de
                Pasio Padel Club ou de ses partenaires et est protégé par les
                lois françaises et internationales relatives à la propriété
                intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication,
                adaptation de tout ou partie des éléments du site, quel que soit
                le moyen ou le procédé utilisé, est interdite, sauf autorisation
                écrite préalable de Pasio Padel Club.
              </p>
            </LegalSection>

            <LegalSection title="5. Protection des données personnelles">
              <p>
                Conformément au Règlement Général sur la Protection des Données
                (RGPD) et à la loi Informatique et Libertés, vous disposez
                d&apos;un droit d&apos;accès, de rectification, de suppression
                et d&apos;opposition aux données personnelles vous concernant.
              </p>
              <p>
                Les données collectées via le formulaire de contact sont
                utilisées uniquement pour répondre à vos demandes et ne sont
                jamais transmises à des tiers.
              </p>
              <p>
                Pour exercer vos droits, contactez-nous à{' '}
                <a
                  href="mailto:contact@pasiopadelclub.fr"
                  className="text-primary hover:underline"
                >
                  contact@pasiopadelclub.fr
                </a>
                .
              </p>
            </LegalSection>

            <LegalSection title="6. Cookies">
              <p>
                Le site peut utiliser des cookies pour améliorer
                l&apos;expérience utilisateur. Ces cookies sont essentiels au
                bon fonctionnement du site et ne collectent pas de données
                personnelles à des fins publicitaires.
              </p>
            </LegalSection>

            <LegalSection title="7. Limitation de responsabilité">
              <p>
                Pasio Padel Club s&apos;efforce d&apos;assurer l&apos;exactitude
                et la mise à jour des informations diffusées sur ce site.
                Toutefois, Pasio Padel Club ne peut garantir l&apos;exactitude,
                la précision ou l&apos;exhaustivité des informations
                disponibles.
              </p>
              <p>
                En conséquence, Pasio Padel Club décline toute responsabilité
                pour toute imprécision, inexactitude ou omission portant sur des
                informations disponibles sur ce site.
              </p>
            </LegalSection>

            <LegalSection title="8. Droit applicable">
              <p>
                Les présentes mentions légales sont régies par le droit
                français. En cas de litige, les tribunaux français seront seuls
                compétents.
              </p>
            </LegalSection>
          </div>
        </div>
      </section>
    </main>
  )
}

export const Route = createFileRoute('/_public__root/mentions-legales/')({
  component: MentionsLegalesPage,
  head: () => {
    return {
      meta: seo({
        title: 'Mentions légales',
        description:
          "Mentions légales de Pasio Padel Club à Anglet. Informations sur l'éditeur, l'hébergement et la protection des données personnelles.",
        pathname: '/mentions-legales'
      })
    }
  }
})
