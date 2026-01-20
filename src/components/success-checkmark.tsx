import { CheckIcon } from 'lucide-react'
import { motion, type Variants } from 'motion/react'

const CHECK_VARIANTS = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      delay: 0.1
    }
  }
} as const satisfies Variants

const GLOW_VARIANTS = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: [1, 1.3, 1],
    opacity: [0.6, 0.8, 0],
    transition: {
      duration: 1.2,
      delay: 0.2,
      ease: 'easeOut'
    }
  }
} as const satisfies Variants

const RING_VARIANTS = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 20
    }
  }
} as const satisfies Variants

type SuccessCheckmarkProps = {
  shouldReduceMotion: boolean | null
}

export const SuccessCheckmark = ({
  shouldReduceMotion
}: SuccessCheckmarkProps) => {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        variants={shouldReduceMotion ? undefined : GLOW_VARIANTS}
        initial="hidden"
        animate="visible"
        className="absolute size-24 rounded-full bg-primary/30 blur-xl"
      />
      <motion.div
        variants={shouldReduceMotion ? undefined : RING_VARIANTS}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        animate="visible"
        className="absolute size-20 rounded-full border-[3px] border-primary/20"
      />
      <motion.div
        variants={shouldReduceMotion ? undefined : CHECK_VARIANTS}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        animate="visible"
        className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-600 shadow-lg shadow-primary/25"
      >
        <CheckIcon
          className="size-8 text-primary-foreground"
          strokeWidth={3}
          aria-hidden="true"
        />
      </motion.div>
    </div>
  )
}
