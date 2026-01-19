import React from 'react'

type FaqItem = {
  question: string
  answer: string
}

const FAQ_ITEMS = [
  {
    question: "Qu'est-ce que le padel et en quoi diffère-t-il du tennis ?",
    answer:
      'Le padel est un sport de raquette dynamique qui combine des éléments du tennis et du squash. Contrairement au tennis classique, le padel se joue sur un court plus petit entouré de parois vitrées sur lesquelles la balle peut rebondir, ajoutant une dimension unique au jeu.'
  },
  {
    question: 'Le padel est-il adapté aux enfants ou aux seniors ?',
    answer:
      'Absolument. Le padel est un sport à faible impact et doux pour les articulations, ce qui le rend idéal pour les enfants, les adultes et les seniors. Sa nature sociale et accessible en fait un moyen ludique pour tous les âges de rester actif et engagé.'
  },
  {
    question: 'Comment dois-je me vêtir pour jouer au padel ?',
    answer:
      "Nous recommandons des vêtements de sport confortables et des chaussures de court avec une bonne adhérence. Aucun équipement spécial n'est nécessaire, habillez-vous simplement comme pour une session de tennis ou de gym."
  },
  {
    question: 'Proposez-vous la location de raquettes ?',
    answer:
      "Oui, nous proposons la location de raquettes de padel de qualité directement au club. Idéal pour les débutants ou si vous souhaitez essayer différents modèles avant d'acheter."
  },
  {
    question: 'Comment réserver un terrain de padel ?',
    answer:
      'La réservation est simple et rapide. Vous pouvez réserver directement en ligne via notre système de réservation ou nous appeler au 09 71 11 79 28. Nous sommes ouverts tous les jours de 8h à 22h.'
  },
  {
    question: 'Proposez-vous des cours de padel ?',
    answer:
      'Oui, nous proposons des cours particuliers et collectifs pour tous les niveaux. Nos coachs certifiés vous aideront à progresser, que vous soyez débutant ou joueur confirmé cherchant à perfectionner votre technique.'
  }
] as const satisfies FaqItem[]

export const Faq = () => {
  return (
    <section
      itemScope
      itemType="https://schema.org/FAQPage"
      className="container flex flex-col gap-8"
    >
      <h2 className="font-display text-left text-xl md:text-2xl lg:text-3xl">
        FAQ
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        {FAQ_ITEMS.map((item, index) => {
          return (
            <div
              key={index}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className="border-b border-border last:border-b-0 flex flex-col gap-y-4 py-6 first:pt-0 md:nth-2:pt-0 last:pb-0"
            >
              <h3
                itemProp="name"
                className="font-sans text-base font-semibold text-foreground lg:text-lg"
              >
                {item.question}
              </h3>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p itemProp="text" className="text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
