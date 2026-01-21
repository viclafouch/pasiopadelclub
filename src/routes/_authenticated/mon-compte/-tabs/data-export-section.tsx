import { DownloadIcon } from 'lucide-react'
import { LoadingButton } from '@/components/loading-button'
import { formatDateKey } from '@/helpers/date'
import { downloadJson } from '@/helpers/download'
import { getErrorMessage } from '@/helpers/error'
import { exportMyDataFn } from '@/server/users'
import { useMutation } from '@tanstack/react-query'

export const DataExportSection = () => {
  const exportMutation = useMutation({
    mutationFn: () => {
      return exportMyDataFn()
    },
    onSuccess: (data) => {
      const filename = `pasio-padel-data-${formatDateKey(new Date())}.json`
      downloadJson(data, filename)
    }
  })

  return (
    <div className="rounded-lg border p-6">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <div>
          <h3 className="text-base font-semibold">Mes données (RGPD)</h3>
          <p className="text-sm text-muted-foreground">
            Téléchargez une copie de vos données personnelles au format JSON.
          </p>
        </div>
        <LoadingButton
          variant="outline"
          onClick={() => {
            return exportMutation.mutate()
          }}
          isLoading={exportMutation.isPending}
          loadingText="Préparation..."
          className="w-full shrink-0 xs:w-auto"
        >
          <DownloadIcon className="size-4" aria-hidden="true" />
          Exporter mes données
        </LoadingButton>
      </div>
      {exportMutation.isError ? (
        <p role="alert" className="pt-4 text-sm text-destructive">
          {getErrorMessage(exportMutation.error)}
        </p>
      ) : null}
    </div>
  )
}
