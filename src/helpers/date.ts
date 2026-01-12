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
