import React from 'react'
import {
  CheckCircleIcon,
  FilterIcon,
  MapPinIcon,
  UsersIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import {
  AVAILABILITY_OPTIONS_EXTENDED,
  type AvailabilityFilter,
  COURT_TYPE_OPTIONS_EXTENDED,
  type CourtTypeFilter,
  LOCATION_OPTIONS_EXTENDED,
  type LocationFilter
} from '@/constants/court'
import { cn } from '@/lib/utils'

type FilterDrawerProps = {
  courtType: CourtTypeFilter
  location: LocationFilter
  availability: AvailabilityFilter
  onCourtTypeChange: (type: CourtTypeFilter) => void
  onLocationChange: (location: LocationFilter) => void
  onAvailabilityChange: (availability: AvailabilityFilter) => void
}

export const FilterDrawer = ({
  courtType,
  location,
  availability,
  onCourtTypeChange,
  onLocationChange,
  onAvailabilityChange
}: FilterDrawerProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const firstButtonRef = React.useRef<HTMLButtonElement>(null)
  const hasActiveFilters =
    courtType !== 'all' || location !== 'all' || availability !== 'all'

  const handleReset = () => {
    onCourtTypeChange('all')
    onLocationChange('all')
    onAvailabilityChange('all')
  }

  const handleOpenAutoFocus = (event: Event) => {
    event.preventDefault()
    firstButtonRef.current?.focus()
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="relative md:hidden">
          <FilterIcon className="size-4" aria-hidden="true" />
          Filtres
          {hasActiveFilters ? (
            <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-primary" />
          ) : null}
        </Button>
      </DrawerTrigger>
      <DrawerContent onOpenAutoFocus={handleOpenAutoFocus}>
        <DrawerHeader>
          <DrawerTitle>Filtrer les terrains</DrawerTitle>
          <DrawerDescription className="sr-only">
            Sélectionnez le type de terrain et la localisation
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-6 px-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <UsersIcon className="size-4" aria-hidden="true" />
              Type de terrain
            </div>
            <div className="grid grid-cols-2 gap-2">
              {COURT_TYPE_OPTIONS_EXTENDED.map((option, index) => {
                const isSelected = courtType === option.value

                return (
                  <Button
                    key={option.value}
                    ref={index === 0 ? firstButtonRef : undefined}
                    variant="outline"
                    size="sm"
                    aria-pressed={isSelected}
                    onClick={() => {
                      return onCourtTypeChange(option.value)
                    }}
                    className={cn(
                      'h-10 justify-start',
                      isSelected && 'border-primary bg-primary/10 text-primary'
                    )}
                  >
                    {option.label}
                  </Button>
                )
              })}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPinIcon className="size-4" aria-hidden="true" />
              Localisation
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LOCATION_OPTIONS_EXTENDED.map((option) => {
                const isSelected = location === option.value

                return (
                  <Button
                    key={option.value}
                    variant="outline"
                    size="sm"
                    aria-pressed={isSelected}
                    onClick={() => {
                      return onLocationChange(option.value)
                    }}
                    className={cn(
                      'h-10 justify-start',
                      isSelected && 'border-primary bg-primary/10 text-primary'
                    )}
                  >
                    {option.label}
                  </Button>
                )
              })}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircleIcon className="size-4" aria-hidden="true" />
              Disponibilité
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABILITY_OPTIONS_EXTENDED.map((option) => {
                const isSelected = availability === option.value

                return (
                  <Button
                    key={option.value}
                    variant="outline"
                    size="sm"
                    aria-pressed={isSelected}
                    onClick={() => {
                      return onAvailabilityChange(option.value)
                    }}
                    className={cn(
                      'h-10 justify-start',
                      isSelected && 'border-primary bg-primary/10 text-primary'
                    )}
                  >
                    {option.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
        <DrawerFooter className="flex-col gap-2">
          {hasActiveFilters ? (
            <Button variant="outline" className="flex-1" onClick={handleReset}>
              Réinitialiser
            </Button>
          ) : null}
          <DrawerClose asChild>
            <Button className="flex-1">Appliquer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
