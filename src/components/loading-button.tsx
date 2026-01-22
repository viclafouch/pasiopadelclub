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
          <span className="animate-spin">
            <LoaderIcon aria-hidden="true" />
          </span>
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
