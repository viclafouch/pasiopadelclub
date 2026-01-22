import React from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { seo } from '@/utils/seo'
import { createFileRoute } from '@tanstack/react-router'

type GalleryImage = {
  id: number
  src: string
  alt: string
  category: string
}

const GALLERY_IMAGES = [
  {
    id: 1,
    src: '/images/gallery/gallery-01.webp',
    alt: 'Court de padel 1',
    category: 'Courts'
  },
  {
    id: 2,
    src: '/images/gallery/gallery-02.webp',
    alt: 'Joueurs de padel',
    category: 'Matchs'
  },
  {
    id: 3,
    src: '/images/gallery/gallery-03.webp',
    alt: 'Équipement de padel',
    category: 'Équipement'
  },
  {
    id: 4,
    src: '/images/gallery/gallery-04.webp',
    alt: 'Court intérieur',
    category: 'Courts'
  },
  {
    id: 5,
    src: '/images/gallery/gallery-05.webp',
    alt: 'Tournoi de padel',
    category: 'Événements'
  },
  {
    id: 6,
    src: '/images/gallery/gallery-06.webp',
    alt: 'Espace détente',
    category: 'Club'
  },
  {
    id: 7,
    src: '/images/gallery/gallery-07.webp',
    alt: 'Match en double',
    category: 'Matchs'
  },
  {
    id: 8,
    src: '/images/gallery/gallery-08.webp',
    alt: 'Cours collectif',
    category: 'Cours'
  },
  {
    id: 9,
    src: '/images/gallery/gallery-09.webp',
    alt: 'Vue du club',
    category: 'Club'
  }
] as const satisfies readonly GalleryImage[]

const categories = [
  'Tous',
  ...new Set(
    GALLERY_IMAGES.map((img) => {
      return img.category
    })
  )
]

type LightboxProps = {
  images: readonly GalleryImage[]
  currentIndex: number
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

const Lightbox = ({
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext
}: LightboxProps) => {
  const currentImage = images[currentIndex]

  React.useEffect(() => {
    if (!currentImage) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'ArrowLeft') {
        onPrevious()
      } else if (event.key === 'ArrowRight') {
        onNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [currentImage, onClose, onNext, onPrevious])

  if (!currentImage) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Fermer"
      >
        <X className="h-6 w-6" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onPrevious}
        className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-8"
        aria-label="Image précédente"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onNext}
        className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-8"
        aria-label="Image suivante"
      >
        <ChevronRight className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="relative max-h-modal max-w-[90vw]">
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-h-[85vh] max-w-full rounded-lg object-contain"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-center">
          <p className="text-lg font-medium text-white">{currentImage.alt}</p>
          <p className="mt-1 text-sm text-white/70">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      </div>
    </div>
  )
}

const GaleriePage = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('Tous')
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null)

  const filteredImages =
    selectedCategory === 'Tous'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => {
          return img.category === selectedCategory
        })

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const goToPrevious = () => {
    setLightboxIndex((prev) => {
      if (prev === null) {
        return null
      }

      return prev === 0 ? filteredImages.length - 1 : prev - 1
    })
  }

  const goToNext = () => {
    setLightboxIndex((prev) => {
      if (prev === null) {
        return null
      }

      return prev === filteredImages.length - 1 ? 0 : prev + 1
    })
  }

  return (
    <>
      <main className="min-h-screen bg-background">
        <section className="section-py relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

          <div className="container relative">
            <PageHeader
              title="Notre Galerie"
              description="Découvrez nos installations, nos événements et l'ambiance unique de Pasio Padel Club."
            />
          </div>
        </section>

        <section className="section-pb" aria-labelledby="gallery-filters">
          <div className="container">
            <h2 id="gallery-filters" className="sr-only">
              Filtrer par catégorie
            </h2>
            <div className="mb-10 flex flex-wrap justify-center gap-3">
              {categories.map((category) => {
                return (
                  <button
                    type="button"
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                    }}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                        : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredImages.map((image, index) => {
                return (
                  <button
                    type="button"
                    key={image.id}
                    onClick={() => {
                      openLightbox(index)
                    }}
                    className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-card/50"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                      <span className="inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
                        {image.category}
                      </span>
                      <p className="mt-2 text-sm font-medium text-white">
                        {image.alt}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {filteredImages.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">
                  Aucune image dans cette catégorie.
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </main>

      {lightboxIndex !== null ? (
        <Lightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
      ) : null}
    </>
  )
}

export const Route = createFileRoute('/_public__root/galerie/')({
  component: GaleriePage,
  head: () => {
    return {
      ...seo({
        title: 'Galerie',
        description:
          "Découvrez la galerie photos de Pasio Padel Club à Bayonne : nos courts de padel, événements, tournois et l'ambiance du club.",
        keywords:
          'photos padel bayonne, terrains padel indoor, club padel pays basque, galerie pasio padel',
        pathname: '/galerie'
      })
    }
  }
})
