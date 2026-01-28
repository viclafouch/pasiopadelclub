import React from 'react'

export const useBodyScrollLock = (isLocked: boolean) => {
  React.useEffect(() => {
    if (!isLocked) {
      return () => {}
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [isLocked])
}
