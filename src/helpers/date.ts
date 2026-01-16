const DEFAULT_LOCALE: Intl.LocalesArgument = 'fr-FR'

const DEFAULT_DATE_OPTIONS = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
} satisfies Intl.DateTimeFormatOptions

const DEFAULT_TIME_OPTIONS = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
} satisfies Intl.DateTimeFormatOptions

export const formatDateFr = (
  date: Date,
  options?: Intl.DateTimeFormatOptions
) => {
  const formatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    ...DEFAULT_DATE_OPTIONS,
    ...options
  })

  return formatter.format(date)
}

export const formatTimeFr = (
  date: Date,
  options?: Intl.DateTimeFormatOptions
) => {
  const formatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    ...DEFAULT_TIME_OPTIONS,
    ...options
  })

  return formatter.format(date)
}

export const formatDateTimeFr = (
  date: Date,
  options?: Intl.DateTimeFormatOptions
) => {
  const formatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    ...DEFAULT_DATE_OPTIONS,
    ...DEFAULT_TIME_OPTIONS,
    ...options
  })

  return formatter.format(date)
}

export const formatDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const getTodayDateKey = () => {
  return formatDateKey(new Date())
}

export const getTomorrowDateKey = () => {
  const today = new Date()
  const tomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  )

  return formatDateKey(tomorrow)
}

export const getDefaultBookingDateKey = (
  closingHour: number,
  minSessionMinutes: number
) => {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const lastSlotStartMinutes = closingHour * 60 - minSessionMinutes
  const hasRemainingSlots = currentMinutes < lastSlotStartMinutes

  return hasRemainingSlots ? getTodayDateKey() : getTomorrowDateKey()
}

export const getToday = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return today
}

export const generateDates = (count: number) => {
  const today = getToday()

  return Array.from({ length: count }, (_, dayOffset) => {
    const date = new Date(today)
    date.setDate(today.getDate() + dayOffset)

    return date
  })
}

export const formatDayName = (date: Date) => {
  const today = getToday()

  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (date.getTime() === today.getTime()) {
    return "Aujourd'hui"
  }

  if (date.getTime() === tomorrow.getTime()) {
    return 'Demain'
  }

  return date.toLocaleDateString(DEFAULT_LOCALE, { weekday: 'short' })
}

export const formatDayNumber = (date: Date) => {
  return date.toLocaleDateString(DEFAULT_LOCALE, {
    day: 'numeric',
    month: 'short'
  })
}

export const formatFullDateLabel = (date: Date) => {
  return date.toLocaleDateString(DEFAULT_LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export const matchIsToday = (date: Date) => {
  const today = new Date()

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

export const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number) as [
    number,
    number,
    number
  ]

  return new Date(year, month - 1, day)
}
