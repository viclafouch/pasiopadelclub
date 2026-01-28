/* eslint-disable */
import * as React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type StoriesProps = React.ComponentProps<'div'>

const Stories = ({ className, children, ...props }: StoriesProps) => {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    loop: false,
    dragFree: true
  })

  return (
    <div ref={emblaRef} className={cn('overflow-hidden', className)} {...props}>
      {children}
    </div>
  )
}

type StoriesContentProps = React.ComponentProps<'div'>

const StoriesContent = ({ className, ...props }: StoriesContentProps) => {
  return <div className={cn('flex gap-3', className)} {...props} />
}

type StoryProps = React.ComponentProps<'div'>

const Story = ({ className, ...props }: StoryProps) => {
  return (
    <div
      className={cn(
        'group relative shrink-0 cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    />
  )
}

type StoryVideoProps = React.ComponentProps<'video'>

const StoryVideo = ({ className, src, ...props }: StoryVideoProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const initialTime = React.useMemo(() => {
    if (!src) {
      return 0
    }

    const timeMatch = /#t=(\d+)/.exec(src)
    const timeValue = timeMatch?.[1]

    return timeValue ? Number.parseInt(timeValue, 10) : 0
  }, [src])

  const handlePlay = () => {
    videoRef.current?.play()
  }

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = initialTime
    }
  }

  return (
    <video
      ref={videoRef}
      src={src}
      className={cn('absolute inset-0 size-full object-cover', className)}
      muted
      playsInline
      onMouseEnter={handlePlay}
      onMouseLeave={handlePause}
      onFocus={handlePlay}
      onBlur={handlePause}
      {...props}
    />
  )
}

type StoryImageProps = React.ComponentProps<'img'>

const StoryImage = ({ className, alt = '', ...props }: StoryImageProps) => {
  return (
    <img
      alt={alt}
      className={cn(
        'absolute inset-0 size-full object-cover transition-opacity duration-300 group-hover:opacity-90',
        className
      )}
      {...props}
    />
  )
}

type StoryTitleProps = React.ComponentProps<'p'>

const StoryTitle = ({ className, ...props }: StoryTitleProps) => {
  return (
    <p
      className={cn(
        'absolute inset-x-0 top-0 p-3 font-medium text-white text-sm',
        className
      )}
      {...props}
    />
  )
}

type StoryAuthorProps = React.ComponentProps<'div'>

const StoryAuthor = ({ className, ...props }: StoryAuthorProps) => {
  return (
    <div
      className={cn(
        'absolute inset-x-0 bottom-0 flex items-center gap-2 p-3 text-white',
        className
      )}
      {...props}
    />
  )
}

type StoryAuthorImageProps = {
  src?: string
  fallback?: string
  name?: string
  className?: string
}

const StoryAuthorImage = ({
  src,
  fallback,
  name,
  className
}: StoryAuthorImageProps) => {
  const initials = fallback ?? name?.slice(0, 2).toUpperCase() ?? ''

  return (
    <Avatar className={cn('size-8 border-2 border-white', className)}>
      <AvatarImage src={src} alt={name ?? ''} />
      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
    </Avatar>
  )
}

type StoryAuthorNameProps = React.ComponentProps<'span'>

const StoryAuthorName = ({ className, ...props }: StoryAuthorNameProps) => {
  return (
    <span
      className={cn('truncate font-medium text-sm', className)}
      {...props}
    />
  )
}

type StoryOverlayProps = React.ComponentProps<'div'> & {
  side?: 'top' | 'bottom'
}

const StoryOverlay = ({
  className,
  side = 'bottom',
  ...props
}: StoryOverlayProps) => {
  return (
    <div
      className={cn(
        'absolute inset-x-0 h-1/2 pointer-events-none',
        side === 'top'
          ? 'top-0 bg-gradient-to-b from-black/60 to-transparent'
          : 'bottom-0 bg-gradient-to-t from-black/60 to-transparent',
        className
      )}
      {...props}
    />
  )
}

export {
  Stories,
  StoriesContent,
  Story,
  StoryAuthor,
  StoryAuthorImage,
  StoryAuthorName,
  StoryImage,
  StoryOverlay,
  StoryTitle,
  StoryVideo
}
