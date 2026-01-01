import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { BookingSection } from './-components/booking-section'
import { Hero } from './-components/hero'

const RouteComponent = () => {
  return (
    <main className="-top-[60px] relative">
      <Hero />
      <BookingSection />
    </main>
  )
}

export const Route = createFileRoute('/_public__root/')({
  component: RouteComponent
})
