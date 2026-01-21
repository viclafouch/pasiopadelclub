import {
  addDays,
  format,
  getHours,
  getMinutes,
  isBefore,
  isSameDay,
  isToday,
  isValid,
  parse,
  startOfDay
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { TZDate } from '@date-fns/tz'

const FR_LOCALE = { locale: fr }
const PARIS_TZ = 'Europe/Paris'

export const nowParis = () => {
  return TZDate.tz(PARIS_TZ)
}

const toParisDate = (date: Date) => {
  return new TZDate(date, PARIS_TZ)
}

export const formatDateFr = (date: Date) => {
  return format(toParisDate(date), 'dd/MM/yyyy', FR_LOCALE)
}

export const formatTimeFr = (date: Date) => {
  return format(toParisDate(date), 'HH:mm', FR_LOCALE)
}

export const formatDateTimeFr = (date: Date) => {
  return format(toParisDate(date), 'dd/MM/yyyy HH:mm', FR_LOCALE)
}

export const formatDateKey = (date: Date) => {
  return format(date, 'yyyy-MM-dd')
}

export const getTodayDateKey = () => {
  return formatDateKey(nowParis())
}

export const getTomorrowDateKey = () => {
  return formatDateKey(addDays(nowParis(), 1))
}

export const getDefaultBookingDateKey = (
  closingHour: number,
  minSessionMinutes: number
) => {
  const now = nowParis()
  const currentMinutes = getHours(now) * 60 + getMinutes(now)
  const lastSlotStartMinutes = closingHour * 60 - minSessionMinutes
  const hasRemainingSlots = currentMinutes < lastSlotStartMinutes

  return hasRemainingSlots ? getTodayDateKey() : getTomorrowDateKey()
}

type GetValidBookingDateKeyParams = {
  maxDays: number
  closingHour: number
  minSessionMinutes: number
  urlDate?: string
}

export const getValidBookingDateKey = ({
  maxDays,
  closingHour,
  minSessionMinutes,
  urlDate
}: GetValidBookingDateKeyParams) => {
  const defaultDateKey = getDefaultBookingDateKey(
    closingHour,
    minSessionMinutes
  )

  if (!urlDate) {
    return defaultDateKey
  }

  const requestedDate = parse(urlDate, 'yyyy-MM-dd', nowParis())

  if (!isValid(requestedDate)) {
    return defaultDateKey
  }

  const today = getToday()
  const firstValidDate = parseDateKey(defaultDateKey)
  const lastValidDate = addDays(today, maxDays - 1)

  if (isBefore(requestedDate, firstValidDate)) {
    return defaultDateKey
  }

  if (isBefore(lastValidDate, requestedDate)) {
    return formatDateKey(lastValidDate)
  }

  return urlDate
}

export const getToday = () => {
  return startOfDay(nowParis())
}

export const generateDates = (count: number) => {
  const today = getToday()

  return Array.from({ length: count }, (_, dayOffset) => {
    return addDays(today, dayOffset)
  })
}

export const formatDayName = (date: Date) => {
  const today = getToday()
  const tomorrow = addDays(today, 1)

  if (isSameDay(date, today)) {
    return "Aujourd'hui"
  }

  if (isSameDay(date, tomorrow)) {
    return 'Demain'
  }

  return format(toParisDate(date), 'EEE', FR_LOCALE)
}

export const formatDayNumber = (date: Date) => {
  return format(toParisDate(date), 'd MMM', FR_LOCALE)
}

export const formatFullDateLabel = (date: Date) => {
  return format(toParisDate(date), 'EEEE d MMMM yyyy', FR_LOCALE)
}

export const matchIsToday = (date: Date) => {
  return isToday(date)
}

export const parseDateKey = (dateKey: string) => {
  return parse(dateKey, 'yyyy-MM-dd', nowParis())
}

export const formatDateTimeLongFr = (date: Date) => {
  return format(toParisDate(date), "EEEE d MMMM yyyy 'à' HH:mm", FR_LOCALE)
}

export const formatDateWithDayFr = (date: Date) => {
  return format(toParisDate(date), 'EEEE d MMMM', FR_LOCALE)
}
