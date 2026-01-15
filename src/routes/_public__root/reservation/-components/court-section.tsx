import { InfoIcon, MapPinIcon, UsersIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { LOCATION_LABELS } from '@/constants/court'
import type { Court, Slot } from '@/constants/types'
import { SlotCard } from './slot-card'

type CourtSectionProps = {
  court: Court
  slots: Slot[]
  onSlotSelect?: (slot: Slot) => void
}

export const CourtSection = ({
  court,
  slots,
  onSlotSelect
}: CourtSectionProps) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display font-semibold">{court.name}</h3>
        <Badge variant="outline" className="gap-1.5">
          <UsersIcon className="size-3.5" aria-hidden="true" />
          {court.capacity} joueurs
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <MapPinIcon className="size-3.5" aria-hidden="true" />
          {LOCATION_LABELS[court.location]}
        </Badge>
        {court.type === 'kids' ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary">
                  <InfoIcon className="size-3.5" aria-hidden="true" />
                  Ouvert à tous
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ce terrain est accessible à tous les âges</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {slots.map((slot) => {
          return (
            <SlotCard
              key={slot.startAt}
              startAt={slot.startAt}
              endAt={slot.endAt}
              price={court.price}
              status={slot.status}
              isOwnBooking={slot.isOwnBooking}
              onSelect={
                onSlotSelect
                  ? () => {
                      return onSlotSelect(slot)
                    }
                  : undefined
              }
            />
          )
        })}
      </div>
    </div>
  )
}
