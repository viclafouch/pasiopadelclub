import { APP_DOWNLOAD_URL } from '@/constants/app'
import { cn } from '@/lib/utils'

type QRCodeSize = 'small' | 'default' | 'large'

type QRCodeProps = {
  size?: QRCodeSize
  className?: string
}

type QRSizeConfig = {
  pixel: number
  container: string
}

const QR_SIZES = {
  small: { pixel: 100, container: 'size-24' },
  default: { pixel: 150, container: 'size-36' },
  large: { pixel: 200, container: 'size-48' }
} as const satisfies Record<QRCodeSize, QRSizeConfig>

export const QRCode = ({ size = 'default', className }: QRCodeProps) => {
  const { pixel, container } = QR_SIZES[size]

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl bg-white p-2 shadow-md',
        container,
        className
      )}
    >
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=${pixel}x${pixel}&data=${encodeURIComponent(APP_DOWNLOAD_URL)}&format=svg`}
        alt="QR Code pour télécharger l'application"
        className="size-full"
        loading="lazy"
      />
    </div>
  )
}
