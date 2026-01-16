import {
  addDays,
  format,
  getHours,
  getMinutes,
  isSameDay,
  isToday,
  parse,
  startOfDay
} from 'date-fns'
import { fr } from 'date-fns/locale'

const FR_LOCALE = { locale: fr }

export const formatDateFr = (date: Date) => {
  return format(date, 'dd/MM/yyyy', FR_LOCALE)
}

export const formatTimeFr = (date: Date) => {
  return format(date, 'HH:mm', FR_LOCALE)
}

export const formatDateTimeFr = (date: Date) => {
  return format(date, 'dd/MM/yyyy HH:mm', FR_LOCALE)
}

export const formatDateKey = (date: Date) => {
  return format(date, 'yyyy-MM-dd')
}

export const getTodayDateKey = () => {
  return formatDateKey(new Date())
}

export const getTomorrowDateKey = () => {
  return formatDateKey(addDays(new Date(), 1))
}

export const getDefaultBookingDateKey = (
  closingHour: number,
  minSessionMinutes: number
) => {
  const now = new Date()
  const currentMinutes = getHours(now) * 60 + getMinutes(now)
  const lastSlotStartMinutes = closingHour * 60 - minSessionMinutes
  const hasRemainingSlots = currentMinutes < lastSlotStartMinutes

  return hasRemainingSlots ? getTodayDateKey() : getTomorrowDateKey()
}

export const getToday = () => {
  return startOfDay(new Date())
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

  return format(date, 'EEE', FR_LOCALE)
}

export const formatDayNumber = (date: Date) => {
  return format(date, 'd MMM', FR_LOCALE)
}

export const formatFullDateLabel = (date: Date) => {
  return format(date, 'EEEE d MMMM yyyy', FR_LOCALE)
}

export const matchIsToday = (date: Date) => {
  return isToday(date)
}

export const parseDateKey = (dateKey: string) => {
  return parse(dateKey, 'yyyy-MM-dd', new Date())
}
