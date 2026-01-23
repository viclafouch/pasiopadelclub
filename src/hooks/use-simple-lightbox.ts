import React from 'react'

type UseSimpleLightboxParams = {
  totalItems: number
}

export const useSimpleLightbox = ({ totalItems }: UseSimpleLightboxParams) => {
  const [currentIndex, setCurrentIndex] = React.useState<number | null>(null)

  const isOpen = currentIndex !== null

  const open = (index: number) => {
    setCurrentIndex(index)
  }

  const close = () => {
    setCurrentIndex(null)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      return prev === null ? null : prev === 0 ? totalItems - 1 : prev - 1
    })
  }

  const goToNext = () => {
    setCurrentIndex((prev) => {
      return prev === null ? null : prev === totalItems - 1 ? 0 : prev + 1
    })
  }

  return {
    isOpen,
    currentIndex,
    open,
    close,
    goToPrevious,
    goToNext
  }
}
