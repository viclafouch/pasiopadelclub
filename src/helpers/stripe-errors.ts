/* eslint-disable camelcase */
const STRIPE_ERRORS_FR = {
  card_declined: 'Carte refusée',
  insufficient_funds: 'Fonds insuffisants',
  lost_card: 'Carte déclarée perdue',
  stolen_card: 'Carte déclarée volée',
  expired_card: 'Carte expirée',
  incorrect_cvc: 'Code de sécurité incorrect',
  incorrect_number: 'Numéro de carte incorrect',
  incorrect_zip: 'Code postal incorrect',
  invalid_cvc: 'Code de sécurité invalide',
  invalid_expiry_month: "Mois d'expiration invalide",
  invalid_expiry_year: "Année d'expiration invalide",
  invalid_number: 'Numéro de carte invalide',
  processing_error: 'Erreur de traitement, veuillez réessayer',
  rate_limit: 'Trop de tentatives, veuillez patienter',
  authentication_required: 'Authentification requise',
  approve_with_id: 'Paiement non autorisé',
  call_issuer: 'Contactez votre banque',
  do_not_honor: 'Paiement refusé par votre banque',
  do_not_try_again: "Paiement refusé, n'essayez pas à nouveau",
  duplicate_transaction: 'Transaction en double détectée',
  fraudulent: 'Paiement refusé pour suspicion de fraude',
  generic_decline: 'Carte refusée',
  invalid_account: 'Compte invalide',
  invalid_amount: 'Montant invalide',
  new_account_information_available: 'Informations de compte mises à jour',
  no_action_taken: 'Aucune action effectuée',
  not_permitted: 'Opération non autorisée',
  offline_pin_required: 'Code PIN requis',
  online_or_offline_pin_required: 'Code PIN requis',
  pickup_card: 'Carte non autorisée',
  pin_try_exceeded: "Nombre d'essais PIN dépassé",
  reenter_transaction: 'Veuillez réessayer',
  restricted_card: 'Carte restreinte',
  revocation_of_all_authorizations: 'Toutes les autorisations révoquées',
  revocation_of_authorization: 'Autorisation révoquée',
  security_violation: 'Violation de sécurité',
  service_not_allowed: 'Service non autorisé',
  stop_payment_order: "Ordre d'arrêt de paiement",
  testmode_decline: 'Carte de test refusée',
  transaction_not_allowed: 'Transaction non autorisée',
  try_again_later: 'Veuillez réessayer plus tard',
  withdrawal_count_limit_exceeded: 'Limite de retraits atteinte'
} as const

type StripeErrorCode = keyof typeof STRIPE_ERRORS_FR

export function getStripeErrorMessage(code: string) {
  const message = STRIPE_ERRORS_FR[code as StripeErrorCode]

  if (message) {
    return message
  }

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(`[stripe-errors] Code non traduit: ${code}`)
  }

  return 'Paiement refusé, veuillez réessayer ou utiliser une autre carte'
}
