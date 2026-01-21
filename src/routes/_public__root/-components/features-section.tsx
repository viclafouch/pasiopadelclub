import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type Feature = {
  emoji: string
  title: string
  description: string
  highlight?: string
}

const FEATURES = [
  {
    emoji: '📹',
    title: 'Vidéo de vos matchs',
    description: 'Revoyez vos sessions pour progresser',
    highlight: 'Téléchargement gratuit'
  },
  {
    emoji: '🍹',
    title: 'Bar & espace convivial',
    description: 'Détendez-vous entre deux matchs',
    highlight: 'Boissons & snacks'
  },
  {
    emoji: '💆',
    title: 'Presso-thérapie',
    description: "Récupération optimale après l'effort",
    highlight: 'Sur réservation'
  },
  {
    emoji: '🎾',
    title: 'Location de matériel',
    description: 'Raquettes, balles et accessoires',
    highlight: 'À partir de 3€'
  },
  {
    emoji: '🚿',
    title: 'Vestiaires & douches',
    description: 'Équipements modernes',
    highlight: 'Accès inclus'
  }
] as const satisfies Feature[]

type FeatureCardProps = {
  feature: Feature
  className?: string
}

type AvatarData = {
  url: string
  fallback: string
}

type CourtType = 'doubles' | 'simples' | 'kids'

const AVATARS = {
  doubles: [
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Marie&baseColor=f9c9b6&backgroundColor=ffdfbf&mouth=smile',
      fallback: 'MA'
    },
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Jean&baseColor=ac6651&backgroundColor=c0aede&mouth=smile',
      fallback: 'JE'
    },
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Sophie&baseColor=f9c9b6&backgroundColor=ffd5dc&mouth=smile',
      fallback: 'SO'
    },
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Marc&baseColor=ac6651&backgroundColor=d1f4d9&mouth=smile',
      fallback: 'MR'
    }
  ],
  simples: [
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Camille&baseColor=f9c9b6&backgroundColor=ffd5dc&mouth=smile',
      fallback: 'CA'
    },
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Lucas&baseColor=ac6651&backgroundColor=c0aede&mouth=smile',
      fallback: 'LU'
    }
  ],
  kids: [
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Emma&baseColor=f9c9b6&backgroundColor=ffeaa7&mouth=laughing',
      fallback: 'EM'
    },
    {
      url: 'https://api.dicebear.com/9.x/micah/svg?seed=Hugo&baseColor=f9c9b6&backgroundColor=a8e6cf&mouth=laughing',
      fallback: 'HU'
    }
  ]
} as const satisfies Record<CourtType, readonly AvatarData[]>

type AvatarGroupProps = {
  type: CourtType
  size?: 'sm' | 'md'
}

const AvatarGroup = ({ type, size = 'md' }: AvatarGroupProps) => {
  const avatars = AVATARS[type]
  const sizeClass = size === 'sm' ? 'size-6 sm:size-7' : 'size-6 sm:size-8'

  return (
    <div className="flex -space-x-2" aria-hidden="true">
      {avatars.map((avatar) => {
        return (
          <Avatar
            key={avatar.fallback}
            className={cn(sizeClass, 'ring-2 ring-primary')}
          >
            <AvatarImage src={avatar.url} alt="" />
            <AvatarFallback className="text-[10px] sm:text-xs">
              {avatar.fallback}
            </AvatarFallback>
          </Avatar>
        )
      })}
    </div>
  )
}

type CourtStatProps = {
  courts: number
  players: number
  avatarType: CourtType
  label: string
  duration: string
  isSmall?: boolean
}

const CourtStat = ({
  courts,
  players,
  avatarType,
  label,
  duration,
  isSmall = false
}: CourtStatProps) => {
  return (
    <div className="rounded-xl sm:rounded-2xl bg-white/15 p-3 sm:p-4 backdrop-blur-sm">
      <div className="mb-2 sm:mb-3">
        <span className="text-base sm:text-lg font-bold text-white">
          {courts} {courts > 1 ? 'terrains' : 'terrain'}
        </span>
        <p className="text-xs sm:text-sm font-medium text-white/80">{label}</p>
      </div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
        <AvatarGroup type={avatarType} size={isSmall ? 'sm' : 'md'} />
        <span className="whitespace-nowrap text-[10px] sm:text-xs text-white/60">
          {players} {players > 1 ? 'joueurs' : 'joueur'}
        </span>
      </div>
      <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-white/60">
        {duration}
      </div>
    </div>
  )
}

type CourtStatData = Omit<CourtStatProps, 'isSmall'> & { isSmall?: boolean }

const COURT_STATS = [
  {
    courts: 4,
    players: 4,
    avatarType: 'doubles',
    label: 'Doubles',
    duration: '90 min · 60€'
  },
  {
    courts: 2,
    players: 2,
    avatarType: 'simples',
    label: 'Simples',
    duration: '60 min · 30€'
  },
  {
    courts: 1,
    players: 2,
    avatarType: 'kids',
    label: 'Kids',
    duration: '60 min · 15€',
    isSmall: true
  }
] as const satisfies CourtStatData[]

const MainFeatureCard = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-5 sm:p-8',
        className
      )}
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-4 sm:mb-6">
          <span className="mb-2 sm:mb-4 inline-block text-4xl sm:text-5xl">
            🏟️
          </span>
          <h3 className="text-xl sm:text-2xl font-semibold text-white">
            7 pistes panoramiques
          </h3>
          <p className="mt-2 sm:mt-3 max-w-sm text-sm sm:text-base leading-relaxed text-white/80">
            Profitez de nos 7 terrains avec une vue dégagée sur tout le club.
            Intérieurs ou semi-couverts, jouez dans les meilleures conditions
            toute l&apos;année.
          </p>
        </div>
        <div className="mt-auto grid grid-cols-3 gap-2 sm:gap-3">
          {COURT_STATS.map((stat) => {
            return <CourtStat key={stat.label} {...stat} />
          })}
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({ feature, className }: FeatureCardProps) => {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10',
        className
      )}
    >
      <div className="relative z-10">
        <span className="text-3xl sm:text-4xl">{feature.emoji}</span>
        <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-white">
          {feature.title}
        </h3>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-white/60">
          {feature.description}
        </p>
        {feature.highlight ? (
          <span className="mt-3 sm:mt-4 inline-block rounded-full bg-primary/20 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-primary-foreground">
            {feature.highlight}
          </span>
        ) : null}
      </div>
    </div>
  )
}

const BackgroundBlobs = () => {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute top-0 left-1/4 size-[500px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute right-1/4 bottom-0 size-[400px] rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[80px]" />
    </div>
  )
}

const SectionHeader = () => {
  return (
    <div className="mx-auto mb-10 sm:mb-16 max-w-2xl text-center">
      <p className="mb-2 sm:mb-3 text-xs sm:text-sm font-medium uppercase tracking-widest text-primary">
        Nos installations
      </p>
      <h2
        id="features-heading"
        className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white"
      >
        Tout pour votre confort
      </h2>
      <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white/50">
        Une expérience padel unique à Bayonne
      </p>
    </div>
  )
}

export const FeaturesSection = () => {
  return (
    <section
      aria-labelledby="features-heading"
      className="section-py relative overflow-hidden bg-section-dark"
    >
      <BackgroundBlobs />
      <div className="container relative">
        <SectionHeader />
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <MainFeatureCard className="col-span-2 lg:row-span-2" />
            {FEATURES.slice(0, 2).map((feature) => {
              return <FeatureCard key={feature.title} feature={feature} />
            })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {FEATURES.slice(2).map((feature, index, array) => {
              const isLast = index === array.length - 1

              return (
                <FeatureCard
                  key={feature.title}
                  feature={feature}
                  className={isLast ? 'col-span-2 lg:col-span-1' : undefined}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
