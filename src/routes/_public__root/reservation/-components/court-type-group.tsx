import { CheckCircleIcon, UsersIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { COURT_TYPE_DESCRIPTIONS, COURT_TYPE_LABELS } from '@/constants/court'
import type { Court, CourtWithSlots } from '@/constants/types'
import { CourtSection } from './court-section'

type CourtTypeGroupProps = {
  type: Court['type']
  courtsWithSlots: CourtWithSlots[]
}

export const CourtTypeGroup = ({
  type,
  courtsWithSlots
}: CourtTypeGroupProps) => {
  const availableCount = courtsWithSlots.reduce((count, courtWithSlots) => {
    const hasAvailable = courtWithSlots.slots.some((slot) => {
      return slot.status === 'available'
    })

    return hasAvailable ? count + 1 : count
  }, 0)

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold">{COURT_TYPE_LABELS[type]}</h2>
          {availableCount > 0 ? (
            <Badge className="gap-1.5 bg-primary/15 text-primary hover:bg-primary/15">
              <CheckCircleIcon className="size-3.5" aria-hidden="true" />
              {availableCount} dispo
            </Badge>
          ) : null}
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <UsersIcon className="size-4" aria-hidden="true" />
          {COURT_TYPE_DESCRIPTIONS[type]}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {courtsWithSlots.map((courtWithSlots, index) => {
          return (
            <div key={courtWithSlots.court._id}>
              {index > 0 ? (
                <hr className="mb-6 border-border/50" aria-hidden="true" />
              ) : null}
              <CourtSection
                court={courtWithSlots.court}
                slots={courtWithSlots.slots}
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
