import { cn } from '@/lib/utils'

type QRCodeSize = 'small' | 'default' | 'large'

type QRCodeProps = {
  size?: QRCodeSize
  className?: string
}

type QRSizeConfig = {
  src: string
  container: string
}

const QR_SIZES = {
  small: { src: '/images/qr/qr-100.svg', container: 'size-24' },
  default: { src: '/images/qr/qr-150.svg', container: 'size-36' },
  large: { src: '/images/qr/qr-200.svg', container: 'size-48' }
} as const satisfies Record<QRCodeSize, QRSizeConfig>

export const QRCode = ({ size = 'default', className }: QRCodeProps) => {
  const { src, container } = QR_SIZES[size]

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl bg-white p-2 shadow-md',
        container,
        className
      )}
    >
      <img
        src={src}
        alt="QR Code pour télécharger l'application"
        className="size-full"
        loading="lazy"
      />
    </div>
  )
}
