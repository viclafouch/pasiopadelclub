import React from 'react'
import { type MotionValue, useScroll, useTransform } from 'motion/react'

const DEFAULT_SCROLL_RANGE = 300

type UseScrollFadeOptions = {
  enabled?: boolean
  scrollRange?: number
}

type UseScrollFadeReturn = {
  needsFallback: boolean
  opacity: MotionValue<number> | undefined
}

export const useScrollFade = (
  options: UseScrollFadeOptions = {}
): UseScrollFadeReturn => {
  const { enabled = true, scrollRange = DEFAULT_SCROLL_RANGE } = options

  const [needsFallback, setNeedsFallback] = React.useState(false)

  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, scrollRange], [0, 1])

  React.useEffect(() => {
    if (!enabled) {
      return
    }

    const isScrollTimelineSupported = CSS.supports(
      'animation-timeline',
      'scroll()'
    )
    setNeedsFallback(!isScrollTimelineSupported)
  }, [enabled])

  return {
    needsFallback: enabled && needsFallback,
    opacity: enabled && needsFallback ? opacity : undefined
  }
}
