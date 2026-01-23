import React from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useIsMobile } from '@/hooks/use-is-mobile'

const TILT_ANGLE = 8
const AUTO_ANIMATION_DURATION = 6000

type TiltRotation = {
  rotateX: number
  rotateY: number
}

const INITIAL_ROTATION: TiltRotation = { rotateX: 0, rotateY: 0 }

type TiltCardProps = {
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export const TiltCard = ({ children, className, disabled }: TiltCardProps) => {
  const [rotation, setRotation] = React.useState<TiltRotation>(INITIAL_ROTATION)
  const [isUserInteracting, setIsUserInteracting] = React.useState(false)
  const isMobile = useIsMobile()
  const shouldReduceMotion = useReducedMotion()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const animationRef = React.useRef<number | null>(null)
  const startTimeRef = React.useRef<number | null>(null)
  const lastRotationTimeRef = React.useRef<number>(0)

  const isDisabled = disabled || shouldReduceMotion
  const isAutoAnimationDisabled = isDisabled || isMobile

  React.useEffect(() => {
    if (isAutoAnimationDisabled || isUserInteracting) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }

      return undefined
    }

    function animate(timestamp: number) {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress =
        (elapsed % AUTO_ANIMATION_DURATION) / AUTO_ANIMATION_DURATION
      const angle = progress * Math.PI * 2

      setRotation({
        rotateX: Math.sin(angle) * TILT_ANGLE,
        rotateY: Math.cos(angle) * TILT_ANGLE
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAutoAnimationDisabled, isUserInteracting])

  function calculateRotation(clientX: number, clientY: number) {
    const container = containerRef.current

    if (!container) {
      return
    }

    const rect = container.getBoundingClientRect()
    const posX = clientX - rect.left
    const posY = clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    setRotation({
      rotateX: ((posY - centerY) / centerY) * -TILT_ANGLE,
      rotateY: ((posX - centerX) / centerX) * TILT_ANGLE
    })
  }

  function handleMouseEnter() {
    if (isDisabled) {
      return
    }

    setIsUserInteracting(true)
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const now = performance.now()

    if (isDisabled || now - lastRotationTimeRef.current < 16) {
      return
    }

    lastRotationTimeRef.current = now
    calculateRotation(event.clientX, event.clientY)
  }

  function handleMouseLeave() {
    startTimeRef.current = null
    setIsUserInteracting(false)
  }

  function handleTouchStart() {
    if (isDisabled) {
      return
    }

    setIsUserInteracting(true)
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    const now = performance.now()

    if (isDisabled || now - lastRotationTimeRef.current < 16) {
      return
    }

    lastRotationTimeRef.current = now

    const touch = event.touches[0]

    if (!touch) {
      return
    }

    calculateRotation(touch.clientX, touch.clientY)
  }

  function handleTouchEnd() {
    startTimeRef.current = null
    setIsUserInteracting(false)
  }

  return (
    <div
      ref={containerRef}
      style={{ perspective: 1000 }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        className={className}
        animate={{
          rotateX: rotation.rotateX,
          rotateY: rotation.rotateY
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
        style={{
          transformStyle: 'preserve-3d',
          position: 'relative',
          willChange: 'transform'
        }}
      >
        {children}
        {!isDisabled ? (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
              borderRadius: 'inherit'
            }}
          >
            <motion.div
              initial={{ left: '-40%', top: '-100%' }}
              animate={{ left: '140%', top: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 5,
                ease: 'easeInOut'
              }}
              style={{
                position: 'absolute',
                width: '30%',
                height: '200%',
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 55%, transparent 100%)',
                transform: 'rotate(25deg)',
                willChange: 'transform'
              }}
            />
          </div>
        ) : null}
      </motion.div>
    </div>
  )
}
