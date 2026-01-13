import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DAYS_TO_SHOW } from '@/constants/booking'
import {
  formatDateKey,
  formatDayName,
  formatDayNumber,
  generateDates
} from '@/helpers/date'
import { cn } from '@/lib/utils'

type DaySelectorProps = {
  selectedDate: string
  onDateChange: (date: string) => void
}

const dates = generateDates(DAYS_TO_SHOW)

export const DaySelector = ({
  selectedDate,
  onDateChange
}: DaySelectorProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const buttonRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())
  const isUserScrollRef = React.useRef(false)
  const prefersReducedMotion = useReducedMotion()

  const scrollToDate = (dateKey: string, smooth: boolean) => {
    const button = buttonRefs.current.get(dateKey)
    const container = scrollRef.current

    if (!button || !container) {
      return
    }

    const containerWidth = container.offsetWidth
    const buttonLeft = button.offsetLeft
    const buttonWidth = button.offsetWidth

    const scrollLeft = buttonLeft - containerWidth / 2 + buttonWidth / 2

    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: smooth && !prefersReducedMotion ? 'smooth' : 'instant'
    })
  }

  React.useLayoutEffect(() => {
    if (isUserScrollRef.current) {
      isUserScrollRef.current = false

      return undefined
    }

    const frameId = requestAnimationFrame(() => {
      scrollToDate(selectedDate, false)
    })

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [selectedDate])

  const handleDateClick = (dateKey: string) => {
    isUserScrollRef.current = true
    onDateChange(dateKey)
    scrollToDate(dateKey, true)
  }

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent"
        aria-hidden="true"
      />
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-2 sm:justify-center"
      >
        {dates.map((date) => {
          const dateKey = formatDateKey(date)
          const isSelected = dateKey === selectedDate

          return (
            <motion.button
              key={dateKey}
              ref={(element) => {
                if (element) {
                  buttonRefs.current.set(dateKey, element)
                }
              }}
              type="button"
              onClick={() => {
                handleDateClick(dateKey)
              }}
              className={cn(
                'relative flex min-w-[5rem] shrink-0 flex-col items-center gap-0.5 rounded-xl px-4 py-3 transition-colors',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 hover:bg-muted'
              )}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            >
              <span className="text-xs font-medium uppercase tracking-wide opacity-80">
                {formatDayName(date)}
              </span>
              <span className="text-sm font-semibold">
                {formatDayNumber(date)}
              </span>
              {isSelected ? (
                <motion.div
                  layoutId={prefersReducedMotion ? undefined : 'date-indicator'}
                  className="absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-primary"
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', bounce: 0.3, duration: 0.4 }
                  }
                />
              ) : null}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
