export function extractFirstName(fullName: string, fallback = 'Client') {
  return fullName.split(' ')[0] ?? fallback
}
