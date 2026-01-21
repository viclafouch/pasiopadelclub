import { CLUB_INFO } from '@/constants/app'

export const Map = () => {
  return (
    <div className="container section-pb">
      <iframe
        src={CLUB_INFO.address.googleMapsUrl}
        width="600"
        height="450"
        allowFullScreen
        title={`Localisation ${CLUB_INFO.name} - ${CLUB_INFO.address.city}`}
        loading="lazy"
        className="w-full"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
