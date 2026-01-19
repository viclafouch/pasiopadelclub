type PlayStoreIconProps = {
  className?: string
}

export const PlayStoreIcon = ({ className = 'size-6' }: PlayStoreIconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35m13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27m3.35-4.31c.34.27.56.68.56 1.19s-.22.92-.57 1.19l-2.13 1.24-2.5-2.5 2.5-2.5 2.14 1.38M6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
    </svg>
  )
}
