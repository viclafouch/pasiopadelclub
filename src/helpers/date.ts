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
