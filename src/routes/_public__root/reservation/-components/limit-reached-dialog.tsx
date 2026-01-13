import { AlertCircleIcon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { MAX_ACTIVE_BOOKINGS } from '@/constants/booking'

type LimitReachedDialogProps = {
  isOpen: boolean
  onClose: () => void
}

export const LimitReachedDialog = ({
  isOpen,
  onClose
}: LimitReachedDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-amber-500/10">
            <AlertCircleIcon
              className="size-6 text-amber-600"
              aria-hidden="true"
            />
          </div>
          <AlertDialogTitle className="text-center">
            Limite de réservations atteinte
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Vous avez déjà {MAX_ACTIVE_BOOKINGS} réservations actives. Annulez
            une réservation existante depuis votre espace personnel pour pouvoir
            en effectuer une nouvelle.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction onClick={onClose}>Compris</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
