import React from 'react'

const SECOND_MS = 1000

type UseCooldownParams = {
  durationSeconds: number
}

export const useCooldown = ({ durationSeconds }: UseCooldownParams) => {
  const [remainingSeconds, setRemainingSeconds] = React.useState(0)

  const isActive = remainingSeconds > 0

  const start = () => {
    setRemainingSeconds(durationSeconds)
  }

  React.useEffect(() => {
    if (remainingSeconds <= 0) {
      return () => {}
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        return Math.max(0, prev - 1)
      })
    }, SECOND_MS)

    return () => {
      clearInterval(interval)
    }
  }, [remainingSeconds])

  return { isActive, remainingSeconds, start }
}
