import React from 'react'

const MOBILE_BREAKPOINT = 1024
const MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia(MEDIA_QUERY)
  mediaQuery.addEventListener('change', callback)

  return () => {
    return mediaQuery.removeEventListener('change', callback)
  }
}

function getSnapshot() {
  return window.matchMedia(MEDIA_QUERY).matches
}

function getServerSnapshot() {
  return false
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
