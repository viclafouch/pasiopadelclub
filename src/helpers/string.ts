export function sanitizeForHtml(input: string) {
  return input.replace(/[<>&"']/g, '')
}

export function extractFirstName(fullName: string, fallback = 'Client') {
  const firstName = fullName.split(' ')[0] ?? fallback

  return sanitizeForHtml(firstName)
}
