export const LOCALES = ['fr'] as const

export type Locale = (typeof LOCALES)[number]

export const LOCALE_FALLBACK: Locale = 'fr'

export type ValuesByLocale<T> = Record<Locale, T>
