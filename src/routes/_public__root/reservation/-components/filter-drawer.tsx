import React from 'react'
import { FilterIcon, MapPinIcon, UsersIcon } from 'lucide-react'
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
  COURT_TYPE_OPTIONS_EXTENDED,
  type CourtTypeFilter,
  LOCATION_OPTIONS_EXTENDED,
  type LocationFilter
} from '@/constants/court'
import { cn } from '@/lib/utils'

type FilterDrawerProps = {
  courtType: CourtTypeFilter
  location: LocationFilter
  onCourtTypeChange: (type: CourtTypeFilter) => void
  onLocationChange: (location: LocationFilter) => void
}

export const FilterDrawer = ({
  courtType,
  location,
  onCourtTypeChange,
  onLocationChange
}: FilterDrawerProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const hasActiveFilters = courtType !== 'all' || location !== 'all'

  const handleReset = () => {
    onCourtTypeChange('all')
    onLocationChange('all')
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
      <DrawerContent>
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
              {COURT_TYPE_OPTIONS_EXTENDED.map((option) => {
                return (
                  <Button
                    key={option.value}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      return onCourtTypeChange(option.value)
                    }}
                    className={cn(
                      'h-10 justify-start',
                      courtType === option.value &&
                        'border-primary bg-primary/10 text-primary'
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
                return (
                  <Button
                    key={option.value}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      return onLocationChange(option.value)
                    }}
                    className={cn(
                      'h-10 justify-start',
                      location === option.value &&
                        'border-primary bg-primary/10 text-primary'
                    )}
                  >
                    {option.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
        <DrawerFooter className="flex-row gap-2">
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
