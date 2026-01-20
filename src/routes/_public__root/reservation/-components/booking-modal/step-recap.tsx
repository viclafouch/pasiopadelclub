import { type Amenity, CLUB_AMENITIES } from './constants'

const AMENITY_ICONS = {
  racket: '🎾',
  ball: '⚽',
  shower: '🚿',
  drink: '🍹'
} as const satisfies Record<Exclude<Amenity['icon'], 'location'>, string>

const DISPLAY_AMENITIES = CLUB_AMENITIES.filter((amenity) => {
  return amenity.icon !== 'location'
})

export const StepRecap = () => {
  return (
    <div className="space-y-4">
      <ul
        className="grid grid-cols-2 gap-2"
        aria-label="Services disponibles au club"
      >
        {DISPLAY_AMENITIES.map((amenity) => {
          return (
            <li
              key={amenity.title}
              className="flex items-center gap-2.5 rounded-lg border bg-muted/20 px-3 py-2"
            >
              <span className="text-base" aria-hidden="true">
                {AMENITY_ICONS[amenity.icon]}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm">{amenity.title}</p>
                <p className="text-xs text-muted-foreground">
                  {amenity.description}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
