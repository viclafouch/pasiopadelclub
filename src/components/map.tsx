import React from 'react'

export const Map = () => {
  return (
    <div className="container pb-20">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2894.5400183835977!2d-1.496321923788685!3d43.49106897111039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd514182cba36089%3A0xe20604785805f73!2sPASIO%20PADEL%20CLUB!5e0!3m2!1sfr!2sfr!4v1767301750127!5m2!1sfr!2sfr"
        width="600"
        height="450"
        allowFullScreen
        title="Google Maps"
        loading="lazy"
        className="w-full"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
