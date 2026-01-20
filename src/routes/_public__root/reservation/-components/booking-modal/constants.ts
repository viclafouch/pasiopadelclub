import type { Appearance } from '@stripe/stripe-js'

export type PaymentMethod = 'card' | 'credit'

export type SummaryItem = {
  emoji: string
  bg: string
  title: string
  subtitle: string
}

export const AMENITIES = [
  {
    emoji: '🎾',
    bg: 'bg-amber-100/60',
    title: 'Location de raquettes',
    subtitle: 'À partir de 3€'
  },
  {
    emoji: '⚽',
    bg: 'bg-orange-100/60',
    title: 'Balles disponibles',
    subtitle: 'Sur place'
  },
  {
    emoji: '🚿',
    bg: 'bg-cyan-100/60',
    title: 'Vestiaires & douches',
    subtitle: 'Accès inclus'
  },
  {
    emoji: '🍹',
    bg: 'bg-pink-100/60',
    title: 'Bar & espace détente',
    subtitle: 'Boissons et snacks'
  }
] as const satisfies SummaryItem[]

export const STRIPE_FORM_ID = 'stripe-payment-form' as const
export const CREDIT_FORM_ID = 'credit-payment-form' as const

export const ANIMATION_DURATION = 0.15 as const
export const ANIMATION_EASING = [0.4, 0, 0.2, 1] as const

export const STRIPE_APPEARANCE = {
  theme: 'flat',
  variables: {
    colorPrimary: 'hsl(165 40% 28%)',
    colorBackground: 'hsl(0 0% 100%)',
    colorText: 'hsl(262 20% 10%)',
    colorTextSecondary: 'hsl(264 5% 46%)',
    colorDanger: 'hsl(0 84% 60%)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSizeBase: '14px',
    borderRadius: '10px',
    spacingUnit: '4px'
  },
  rules: {
    '.Input': {
      border: '1px solid hsl(265 5% 91%)',
      boxShadow: 'none',
      padding: '12px'
    },
    '.Input:focus': {
      border: '1px solid hsl(165 40% 28%)',
      boxShadow: '0 0 0 3px hsla(165, 40%, 28%, 0.15)'
    },
    '.Label': {
      fontWeight: '500',
      marginBottom: '6px'
    },
    '.Tab': {
      border: '1px solid hsl(265 5% 91%)',
      borderRadius: '10px'
    },
    '.Tab--selected': {
      border: '2px solid hsl(165 40% 28%)',
      backgroundColor: 'hsla(165, 40%, 28%, 0.05)'
    },
    '.AccordionItem': {
      border: '1px solid hsl(265 5% 91%)',
      borderRadius: '10px'
    },
    '.AccordionItem--selected': {
      border: '1px solid hsl(265 5% 85%)'
    }
  }
} as const satisfies Appearance

export const BOOKING_QUERY_KEYS = ['wallet', 'bookings', 'slots'] as const
