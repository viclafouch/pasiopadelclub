import React from 'react'
import { Button } from '@/components/ui/button'

export const BookingSection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <h2 className="mb-12 text-center font-bold text-4xl md:text-5xl lg:text-6xl">
          Réservez Votre Terrain de Padel
        </h2>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-lg">
              <span className="font-semibold text-primary">
                Vivez l&apos;excitation du padel
              </span>{' '}
              sur nos{' '}
              <span className="font-semibold text-primary">
                terrains dernière génération
              </span>
              , conçus pour offrir un équilibre parfait entre performance et
              confort. Que vous soyez un compétiteur aguerri ou nouveau dans ce
              sport, nos{' '}
              <span className="font-semibold text-primary">
                installations premium
              </span>{' '}
              offrent l&apos;environnement idéal pour des{' '}
              <span className="font-semibold text-primary">
                échanges rythmés, des tactiques intelligentes et un jeu
                dynamique
              </span>
              .
            </p>
            <p className="text-lg">
              Réserver un terrain est{' '}
              <span className="font-semibold text-primary">
                rapide et simple
              </span>
              , pour que vous passiez moins de temps à organiser et plus de
              temps sur le court. Réservez votre créneau dès aujourd&apos;hui et
              découvrez pourquoi le padel est l&apos;un des{' '}
              <span className="font-semibold text-primary">
                sports à la croissance la plus rapide au monde
              </span>
              .
            </p>
            <p className="text-lg">
              Jouez entre amis, testez-vous contre des adversaires et créez des{' '}
              <span className="font-semibold text-primary">
                moments inoubliables sur le terrain
              </span>
              .
            </p>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-2xl shadow-sky-900/20">
              <video
                className="aspect-video w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                src="https://videocdn.cdnpk.net/videos/39e599e1-06f4-5f4c-8f26-2808a8b568aa/horizontal/previews/watermarked/large.mp4"
                poster="https://images.pexels.com/videos/992695/pexels-video-992695.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              >
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            </div>
          </div>
        </div>
        <div className="mt-16 flex justify-center">
          <Button size="lg">Voir les tarifs</Button>
        </div>
      </div>
    </section>
  )
}
