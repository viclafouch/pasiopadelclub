import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const SLOTS_90_MIN_COUNT = 9
const SLOTS_60_MIN_COUNT = 14

type SkeletonCourt = {
  type: string
  courtCount: number
  slotsPerCourt: number
}

const SKELETON_COURTS = [
  { type: 'double', courtCount: 4, slotsPerCourt: SLOTS_90_MIN_COUNT },
  { type: 'simple', courtCount: 1, slotsPerCourt: SLOTS_60_MIN_COUNT },
  { type: 'kids', courtCount: 1, slotsPerCourt: SLOTS_60_MIN_COUNT }
] as const satisfies SkeletonCourt[]

const SlotCardSkeleton = () => {
  return (
    <div className="flex w-full flex-col items-center gap-1.5 rounded-xl border-2 border-muted bg-muted/30 px-4 py-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-4 w-12" />
    </div>
  )
}

type CourtSectionSkeletonProps = {
  slotsCount: number
}

const CourtSectionSkeleton = ({ slotsCount }: CourtSectionSkeletonProps) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: slotsCount }).map((_, index) => {
          return <SlotCardSkeleton key={index} />
        })}
      </div>
    </div>
  )
}

type CourtTypeGroupSkeletonProps = {
  courtCount: number
  slotsPerCourt: number
}

const CourtTypeGroupSkeleton = ({
  courtCount,
  slotsPerCourt
}: CourtTypeGroupSkeletonProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-28" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from({ length: courtCount }).map((_, index) => {
          return (
            <div key={index}>
              {index > 0 ? (
                <hr className="mb-6 border-border/50" aria-hidden="true" />
              ) : null}
              <CourtSectionSkeleton slotsCount={slotsPerCourt} />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export const SlotsSkeleton = () => {
  return (
    <div className="space-y-8">
      {SKELETON_COURTS.map((config) => {
        return (
          <CourtTypeGroupSkeleton
            key={config.type}
            courtCount={config.courtCount}
            slotsPerCourt={config.slotsPerCourt}
          />
        )
      })}
    </div>
  )
}
