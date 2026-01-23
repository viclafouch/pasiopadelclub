import React from 'react'

type UseSimpleLightboxParams = {
  totalItems: number
}

export function useSimpleLightbox({ totalItems }: UseSimpleLightboxParams) {
  const [currentIndex, setCurrentIndex] = React.useState<number | null>(null)

  const isOpen = currentIndex !== null

  function open(index: number) {
    setCurrentIndex(index)
  }

  function close() {
    setCurrentIndex(null)
  }

  function goToPrevious() {
    setCurrentIndex((prev) => {
      return prev === null ? null : prev === 0 ? totalItems - 1 : prev - 1
    })
  }

  function goToNext() {
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
