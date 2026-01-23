import { CheckCircleIcon, UsersIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { COURT_TYPE_DESCRIPTIONS, COURT_TYPE_LABELS } from '@/constants/court'
import type { Court, CourtWithSlots, Slot } from '@/constants/types'
import { CourtSection } from './court-section'

type CourtTypeGroupProps = {
  type: Court['type']
  courtsWithSlots: CourtWithSlots[]
  onSlotSelect?: (court: Court, slot: Slot) => void
}

export const CourtTypeGroup = ({
  type,
  courtsWithSlots,
  onSlotSelect
}: CourtTypeGroupProps) => {
  const availableSlotsCount = courtsWithSlots.reduce(
    (total, courtWithSlots) => {
      const availableSlots = courtWithSlots.slots.filter((slot) => {
        return slot.status === 'available'
      })

      return total + availableSlots.length
    },
    0
  )

  return (
    <Card className="border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="px-4 pb-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-lg font-semibold">
            {COURT_TYPE_LABELS[type]}
          </h2>
          {availableSlotsCount > 0 ? (
            <Badge className="gap-1.5 bg-success/15 text-success hover:bg-success/15">
              <CheckCircleIcon className="size-3.5" aria-hidden="true" />
              {availableSlotsCount} dispo
            </Badge>
          ) : null}
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <UsersIcon className="size-4" aria-hidden="true" />
          {COURT_TYPE_DESCRIPTIONS[type]}
        </p>
      </CardHeader>
      <CardContent className="space-y-6 px-4 sm:px-6">
        {courtsWithSlots.map((courtWithSlots, index) => {
          return (
            <div key={courtWithSlots.court.id}>
              {index > 0 ? (
                <hr className="mb-6 border-border/50" aria-hidden="true" />
              ) : null}
              <CourtSection
                court={courtWithSlots.court}
                slots={courtWithSlots.slots}
                onSlotSelect={onSlotSelect}
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
