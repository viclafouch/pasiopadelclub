import { LoaderIcon } from 'lucide-react'
import { Button } from './ui/button'

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
  isLoading: boolean
  loadingText?: string
}

export const LoadingButton = ({
  isLoading,
  loadingText,
  children,
  disabled,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button disabled={isLoading || disabled} aria-busy={isLoading} {...props}>
      {isLoading ? (
        <>
          <LoaderIcon className="animate-spin" aria-hidden="true" />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
