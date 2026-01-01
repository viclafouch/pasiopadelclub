import React from 'react'
import { Star } from 'lucide-react'

type StarRatingProps = {
  rating?: number
  maxStars?: number
  showRating?: boolean
}

export const StarRating = ({
  rating = 5,
  maxStars = 5,
  showRating = true
}: StarRatingProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: maxStars }, (_, index) => {
          const fillPercentage = Math.min(Math.max(rating - index, 0), 1) * 100

          return (
            <div key={index} className="relative">
              <Star className="size-5 text-white/30" strokeWidth={1.5} />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star
                  className="size-5 fill-amber-400 text-amber-400"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          )
        })}
      </div>
      {showRating ? (
        <span className="text-sm font-medium text-white/90">
          {rating.toFixed(1)} sur Google
        </span>
      ) : null}
    </div>
  )
}
