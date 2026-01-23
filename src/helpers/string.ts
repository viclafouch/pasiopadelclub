export function sanitizeForHtml(input: string) {
  return input.replace(/[<>&"']/g, '')
}

export function extractFirstName(fullName: string, fallback = 'Client') {
  const firstName = fullName.split(' ')[0] ?? fallback

  return sanitizeForHtml(firstName)
}

export function maskEmail(email: string) {
  const [local = '', domain = ''] = email.split('@')
  const firstChar = local[0] ?? '?'

  return `${firstChar}***@${domain}`
}
