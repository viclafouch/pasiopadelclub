/* eslint-disable */
import type { ComponentProps, HTMLAttributes } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type BookingStatus = 'confirmed' | 'in-progress' | 'past' | 'cancelled'

export type StatusProps = ComponentProps<typeof Badge> & {
  status: BookingStatus
}

export const Status = ({ className, status, ...props }: StatusProps) => {
  return (
    <Badge
      className={cn('flex items-center gap-2', 'group', status, className)}
      variant="secondary"
      {...props}
    />
  )
}

export type StatusIndicatorProps = HTMLAttributes<HTMLSpanElement>

export const StatusIndicator = ({
  className,
  ...props
}: StatusIndicatorProps) => {
  return (
    <span className="relative flex h-2 w-2" {...props}>
      <span
        className={cn(
          'absolute inline-flex h-full w-full rounded-full opacity-75',
          'group-[.in-progress]:animate-ping',
          'group-[.confirmed]:bg-emerald-500',
          'group-[.in-progress]:bg-blue-500',
          'group-[.past]:bg-gray-400',
          'group-[.cancelled]:bg-red-500'
        )}
      />
      <span
        className={cn(
          'relative inline-flex h-2 w-2 rounded-full',
          'group-[.confirmed]:bg-emerald-500',
          'group-[.in-progress]:bg-blue-500',
          'group-[.past]:bg-gray-400',
          'group-[.cancelled]:bg-red-500'
        )}
      />
    </span>
  )
}

export type StatusLabelProps = HTMLAttributes<HTMLSpanElement>

export const StatusLabel = ({
  className,
  children,
  ...props
}: StatusLabelProps) => {
  return (
    <span className={cn('text-muted-foreground', className)} {...props}>
      {children ?? (
        <>
          <span className="hidden group-[.confirmed]:block">Confirmée</span>
          <span className="hidden group-[.in-progress]:block">En cours</span>
          <span className="hidden group-[.past]:block">Passée</span>
          <span className="hidden group-[.cancelled]:block">Annulée</span>
        </>
      )}
    </span>
  )
}
