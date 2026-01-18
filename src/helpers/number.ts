import {
  type Locale,
  LOCALE_FALLBACK,
  type ValuesByLocale
} from '@/i18n/config'

type FormatCurrencyOptions = Intl.NumberFormatOptions & {
  locale?: Locale
}

export const FORMAT_OPTIONS_BY_LOCALE = {
  fr: {
    style: 'currency',
    minimumFractionDigits: 2,
    currency: 'EUR'
  }
} as const satisfies ValuesByLocale<Intl.NumberFormatOptions>

export function formatEuros(euros: number, options?: FormatCurrencyOptions) {
  const locale = options?.locale ?? LOCALE_FALLBACK
  const localeDefaults = FORMAT_OPTIONS_BY_LOCALE[locale]
  const formatted = euros.toLocaleString(locale, {
    ...localeDefaults,
    ...options
  })

  return formatted.replace(/\s/g, '')
}

export function convertCentsToEuros(cents: number) {
  return cents / 100
}

export function formatCentsToEuros(
  cents: number,
  options?: FormatCurrencyOptions
) {
  return formatEuros(convertCentsToEuros(cents), options)
}
