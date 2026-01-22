import { APP_STORE_URL, PLAY_STORE_URL } from '@/constants/app'
import { cn } from '@/lib/utils'
import { AppleIcon } from './apple-icon'
import { PlayStoreIcon } from './play-store-icon'

type StoreBadgeProps = {
  store: 'apple' | 'google'
  size?: 'default' | 'large'
  className?: string
}

export const StoreBadge = ({
  store,
  size = 'default',
  className
}: StoreBadgeProps) => {
  const isApple = store === 'apple'
  const isLarge = size === 'large'

  return (
    <a
      href={isApple ? APP_STORE_URL : PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-3 rounded-xl bg-neutral px-5 text-neutral-foreground transition-transform hover:scale-105',
        isLarge ? 'h-16 gap-4 rounded-2xl px-6 hover:shadow-xl' : 'h-14',
        className
      )}
    >
      {isApple ? (
        <AppleIcon className={isLarge ? 'size-7' : 'size-6'} />
      ) : (
        <PlayStoreIcon className={isLarge ? 'size-7' : 'size-6'} />
      )}
      <div className="flex flex-col">
        <span
          className={cn(
            'leading-tight opacity-80',
            isLarge ? 'text-xs' : 'text-[10px]'
          )}
        >
          {isApple ? 'Télécharger sur' : 'Disponible sur'}
        </span>
        <span
          className={cn(
            'font-semibold leading-tight',
            isLarge ? 'text-lg' : 'text-base'
          )}
        >
          {isApple ? 'App Store' : 'Google Play'}
        </span>
      </div>
    </a>
  )
}
