import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import {
  getActiveBookingCountQueryOpts,
  getBookingHistoryQueryOpts,
  getSlotsByDateQueryOpts,
  getUpcomingBookingsQueryOpts,
  getUserBalanceQueryOpts,
  getWalletTransactionsQueryOpts
} from '@/constants/queries'
import type { Booking, Court } from '@/constants/types'
import { getErrorMessage } from '@/helpers/error'
import { cancelBookingFn } from '@/server/bookings'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export type CancelDialogData = {
  bookingId: Booking['id']
  courtName: Court['name']
  date: string
  time: string
  isFullRefund: boolean
}

type RefundInfoParams = {
  isFullRefund: boolean
}

const RefundInfo = ({ isFullRefund }: RefundInfoParams) => {
  if (isFullRefund) {
    return (
      <p className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-700">
        Bonne nouvelle : vous serez remboursé{' '}
        <span className="font-semibold">intégralement</span> car
        l&apos;annulation intervient plus de 24h avant le créneau.
      </p>
    )
  }

  return (
    <p className="rounded-md bg-amber-500/10 p-3 text-sm text-amber-700">
      Vous serez remboursé à hauteur de{' '}
      <span className="font-semibold">50%</span> car l&apos;annulation
      intervient moins de 24h avant le créneau.
    </p>
  )
}

type CancelBookingDialogParams = {
  data: CancelDialogData
  onClose: () => void
  onSuccess: (data: CancelDialogData) => void
}

export const CancelBookingDialog = ({
  data,
  onClose,
  onSuccess
}: CancelBookingDialogParams) => {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = React.useState(true)

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => {
      return cancelBookingFn({ data: { bookingId } })
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries(getUpcomingBookingsQueryOpts()),
        queryClient.invalidateQueries(getActiveBookingCountQueryOpts()),
        queryClient.invalidateQueries(getBookingHistoryQueryOpts()),
        queryClient.invalidateQueries({
          queryKey: getSlotsByDateQueryOpts.all
        }),
        queryClient.invalidateQueries(getUserBalanceQueryOpts()),
        queryClient.invalidateQueries(getWalletTransactionsQueryOpts())
      ])

      setIsOpen(false)
      onSuccess(data)
    }
  })

  const handleConfirm = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    cancelMutation.mutate(data.bookingId)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && !cancelMutation.isPending) {
      setIsOpen(false)
    }
  }

  const handleAnimationEnd = () => {
    if (!isOpen) {
      onClose()
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent onAnimationEnd={handleAnimationEnd}>
        <AlertDialogHeader>
          <AlertDialogTitle>Annuler la réservation</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Vous êtes sur le point d&apos;annuler votre réservation du{' '}
                <span className="font-medium">{data.date}</span> à{' '}
                <span className="font-medium">{data.time}</span>.
              </p>
              <RefundInfo isFullRefund={data.isFullRefund} />
              <p className="text-muted-foreground">
                Souhaitez-vous continuer ?
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {cancelMutation.isError ? (
          <p role="alert" className="text-sm text-destructive">
            {getErrorMessage(cancelMutation.error)}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cancelMutation.isPending}>
            Non, garder
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={cancelMutation.isPending}
            aria-busy={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? 'Annulation...' : 'Oui, annuler'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
