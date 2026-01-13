import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  InfoIcon,
  XCircleIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

type NotificationVariant = 'success' | 'error' | 'warning' | 'info'

type AnimatedNotificationProps = {
  show: boolean
  variant?: NotificationVariant
  children: ReactNode
  className?: string
}

const VARIANT_STYLES = {
  success: {
    container: 'border-green-500/50 bg-green-500/10',
    icon: 'text-green-600',
    text: 'text-green-700',
    Icon: CheckCircle2Icon
  },
  error: {
    container: 'border-red-500/50 bg-red-500/10',
    icon: 'text-red-600',
    text: 'text-red-700',
    Icon: XCircleIcon
  },
  warning: {
    container: 'border-amber-500/50 bg-amber-500/10',
    icon: 'text-amber-600',
    text: 'text-amber-700',
    Icon: AlertCircleIcon
  },
  info: {
    container: 'border-blue-500/50 bg-blue-500/10',
    icon: 'text-blue-600',
    text: 'text-blue-700',
    Icon: InfoIcon
  }
} satisfies Record<
  NotificationVariant,
  {
    container: string
    icon: string
    text: string
    Icon: typeof CheckCircle2Icon
  }
>

const ANIMATION_DURATION = 0.3
const EASE_OUT = [0.4, 0, 0.2, 1] as const

export const AnimatedNotification = ({
  show,
  variant = 'success',
  children,
  className
}: AnimatedNotificationProps) => {
  const shouldReduceMotion = useReducedMotion()
  const styles = VARIANT_STYLES[variant]
  const IconComponent = styles.Icon

  return (
    <AnimatePresence mode="sync">
      {show ? (
        <motion.div
          initial={
            shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
          }
          animate={
            shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }
          }
          exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={{ duration: ANIMATION_DURATION, ease: EASE_OUT }}
          className="overflow-hidden"
        >
          <div
            role="status"
            className={cn(
              'flex items-center gap-3 rounded-lg border p-4 mb-6',
              styles.container,
              className
            )}
          >
            <IconComponent
              className={cn('size-5 shrink-0', styles.icon)}
              aria-hidden="true"
            />
            <p className={cn('text-sm', styles.text)}>{children}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
