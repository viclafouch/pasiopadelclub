import { CheckCircleIcon, MapPinIcon, UsersIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  AVAILABILITY_OPTIONS,
  type AvailabilityFilter,
  COURT_TYPE_OPTIONS,
  type CourtTypeFilter,
  LOCATION_OPTIONS,
  type LocationFilter
} from '@/constants/court'

type FilterBarProps = {
  courtType: CourtTypeFilter
  location: LocationFilter
  availability: AvailabilityFilter
  onCourtTypeChange: (type: CourtTypeFilter) => void
  onLocationChange: (location: LocationFilter) => void
  onAvailabilityChange: (availability: AvailabilityFilter) => void
}

export const FilterBar = ({
  courtType,
  location,
  availability,
  onCourtTypeChange,
  onLocationChange,
  onAvailabilityChange
}: FilterBarProps) => {
  const selectedTypeLabel =
    COURT_TYPE_OPTIONS.find((option) => {
      return option.value === courtType
    })?.label ?? 'Type'

  const selectedLocationLabel =
    LOCATION_OPTIONS.find((option) => {
      return option.value === location
    })?.label ?? 'Lieu'

  const selectedAvailabilityLabel =
    AVAILABILITY_OPTIONS.find((option) => {
      return option.value === availability
    })?.label ?? 'Disponibilité'

  return (
    <div className="hidden items-center gap-3 md:flex">
      <Select
        value={courtType}
        onValueChange={(value) => {
          onCourtTypeChange(value as CourtTypeFilter)
        }}
      >
        <SelectTrigger
          className="w-auto min-w-[150px]"
          aria-label="Type de terrain"
        >
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
        <SelectTrigger
          className="w-auto min-w-[150px]"
          aria-label="Localisation"
        >
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
      <Select
        value={availability}
        onValueChange={(value) => {
          onAvailabilityChange(value as AvailabilityFilter)
        }}
      >
        <SelectTrigger
          className="w-auto min-w-[150px]"
          aria-label="Disponibilité"
        >
          <CheckCircleIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <SelectValue>{selectedAvailabilityLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent position="popper" align="start">
          {AVAILABILITY_OPTIONS.map((option) => {
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
