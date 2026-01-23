import React from 'react'

export const useBodyScrollLock = (isLocked: boolean) => {
  React.useEffect(() => {
    if (!isLocked) {
      return undefined
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [isLocked])
}
