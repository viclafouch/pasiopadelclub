import { MapPinIcon, UsersIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  COURT_TYPE_OPTIONS,
  type CourtTypeFilter,
  LOCATION_OPTIONS,
  type LocationFilter
} from '@/constants/court'

type FilterBarProps = {
  courtType: CourtTypeFilter
  location: LocationFilter
  onCourtTypeChange: (type: CourtTypeFilter) => void
  onLocationChange: (location: LocationFilter) => void
}

export const FilterBar = ({
  courtType,
  location,
  onCourtTypeChange,
  onLocationChange
}: FilterBarProps) => {
  const selectedTypeLabel =
    COURT_TYPE_OPTIONS.find((option) => {
      return option.value === courtType
    })?.label ?? 'Type'

  const selectedLocationLabel =
    LOCATION_OPTIONS.find((option) => {
      return option.value === location
    })?.label ?? 'Lieu'

  return (
    <div className="hidden items-center gap-3 md:flex">
      <Select
        value={courtType}
        onValueChange={(value) => {
          onCourtTypeChange(value as CourtTypeFilter)
        }}
      >
        <SelectTrigger className="w-auto min-w-[150px]">
          <UsersIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <SelectValue>{selectedTypeLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent position="popper" align="start">
          {COURT_TYPE_OPTIONS.map((option) => {
            return (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
      <Select
        value={location}
        onValueChange={(value) => {
          onLocationChange(value as LocationFilter)
        }}
      >
        <SelectTrigger className="w-auto min-w-[150px]">
          <MapPinIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <SelectValue>{selectedLocationLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent position="popper" align="start">
          {LOCATION_OPTIONS.map((option) => {
            return (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
