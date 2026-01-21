function matchIsInternalPath(path: string) {
  return path.startsWith('/') && !path.startsWith('//')
}

export function getSafeRedirect(redirectParam?: string) {
  if (!redirectParam) {
    return '/'
  }

  return matchIsInternalPath(redirectParam) ? redirectParam : '/'
}
