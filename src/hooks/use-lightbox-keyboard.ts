import React from 'react'

type UseLightboxKeyboardParams = {
  isActive: boolean
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

export const useLightboxKeyboard = ({
  isActive,
  onClose,
  onPrevious,
  onNext
}: UseLightboxKeyboardParams) => {
  React.useEffect(() => {
    if (!isActive) {
      return () => {}
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          onPrevious()
          break
        case 'ArrowRight':
          onNext()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive, onClose, onPrevious, onNext])
}
