import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { DAYS_TO_SHOW } from '@/constants/booking'
import {
  formatDateKey,
  formatDayName,
  formatDayNumber,
  formatFullDateLabel,
  generateDates,
  matchIsToday
} from '@/helpers/date'
import { cn } from '@/lib/utils'

const SCROLL_AMOUNT = 200

type DaySelectorProps = {
  selectedDate: string
  onDateChange: (date: string) => void
  onDateHover?: (date: string) => void
}

export const DaySelector = ({
  selectedDate,
  onDateChange,
  onDateHover
}: DaySelectorProps) => {
  const dates = generateDates(DAYS_TO_SHOW)

  const scrollRef = React.useRef<HTMLDivElement>(null)
  const buttonRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())
  const isUserScrollRef = React.useRef(false)
  const prefersReducedMotion = useReducedMotion()
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)
  const startSentinelRef = React.useRef<HTMLDivElement>(null)
  const endSentinelRef = React.useRef<HTMLDivElement>(null)

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

      return () => {}
    }

    const frameId = requestAnimationFrame(() => {
      scrollToDate(selectedDate, false)
    })

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [selectedDate])

  React.useEffect(() => {
    const container = scrollRef.current
    const startSentinel = startSentinelRef.current
    const endSentinel = endSentinelRef.current

    if (!container || !startSentinel || !endSentinel) {
      return () => {}
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === startSentinel) {
            setCanScrollLeft(!entry.isIntersecting)
          } else if (entry.target === endSentinel) {
            setCanScrollRight(!entry.isIntersecting)
          }
        }
      },
      { root: container, threshold: 0.1 }
    )

    observer.observe(startSentinel)
    observer.observe(endSentinel)

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleDateClick = (dateKey: string) => {
    isUserScrollRef.current = true
    onDateChange(dateKey)
    scrollToDate(dateKey, true)
  }

  const handleScrollLeft = () => {
    const container = scrollRef.current

    if (!container) {
      return
    }

    container.scrollBy({
      left: -SCROLL_AMOUNT,
      behavior: prefersReducedMotion ? 'instant' : 'smooth'
    })
  }

  const handleScrollRight = () => {
    const container = scrollRef.current

    if (!container) {
      return
    }

    container.scrollBy({
      left: SCROLL_AMOUNT,
      behavior: prefersReducedMotion ? 'instant' : 'smooth'
    })
  }

  return (
    <nav aria-label="Sélection de la date" className="relative overflow-hidden">
      <button
        type="button"
        onClick={handleScrollLeft}
        className={cn(
          'absolute inset-y-0 left-0 z-10 flex w-10 items-center justify-start bg-gradient-to-r from-background via-background/40 to-transparent pl-1 transition-opacity duration-500',
          canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-label="Afficher les dates précédentes"
        tabIndex={canScrollLeft ? 0 : -1}
      >
        <ChevronLeftIcon className="size-5 text-muted-foreground" />
      </button>
      <button
        type="button"
        onClick={handleScrollRight}
        className={cn(
          'absolute inset-y-0 right-0 z-10 flex w-10 items-center justify-end bg-gradient-to-l from-background via-background/40 to-transparent pr-1 transition-opacity duration-500',
          canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-label="Afficher les dates suivantes"
        tabIndex={canScrollRight ? 0 : -1}
      >
        <ChevronRightIcon className="size-5 text-muted-foreground" />
      </button>
      <div
        ref={scrollRef}
        role="listbox"
        aria-label="Dates disponibles"
        className="scrollbar-hide flex gap-2 overflow-x-auto py-2"
      >
        <div
          ref={startSentinelRef}
          className="w-2 shrink-0 self-stretch sm:w-px"
          aria-hidden="true"
        />
        {dates.map((date) => {
          const dateKey = formatDateKey(date)
          const isSelected = dateKey === selectedDate
          const isToday = matchIsToday(date)
          const fullDateLabel = formatFullDateLabel(date)

          return (
            <motion.button
              key={dateKey}
              ref={(element) => {
                if (element) {
                  buttonRefs.current.set(dateKey, element)
                }
              }}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-current={isToday ? 'date' : undefined}
              aria-label={`Réserver le ${fullDateLabel}`}
              onClick={() => {
                handleDateClick(dateKey)
              }}
              onMouseEnter={() => {
                onDateHover?.(dateKey)
              }}
              className={cn(
                'relative flex min-w-[5rem] shrink-0 flex-col items-center gap-0.5 rounded-xl px-4 py-3 transition-colors',
                isSelected
                  ? 'bg-neutral text-neutral-foreground'
                  : 'bg-muted/50 hover:bg-muted'
              )}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            >
              <span className="text-xs font-medium uppercase tracking-wide opacity-80">
                {formatDayName(date)}
              </span>
              <time dateTime={dateKey} className="text-sm font-semibold">
                {formatDayNumber(date)}
              </time>
              {isSelected ? (
                <motion.div
                  layoutId={prefersReducedMotion ? undefined : 'date-indicator'}
                  className="absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-neutral"
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', bounce: 0.3, duration: 0.4 }
                  }
                  aria-hidden="true"
                />
              ) : null}
            </motion.button>
          )
        })}
        <div
          ref={endSentinelRef}
          className="w-2 shrink-0 self-stretch sm:w-px"
          aria-hidden="true"
        />
      </div>
    </nav>
  )
}
