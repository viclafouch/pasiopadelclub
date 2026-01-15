import { DownloadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
      const filename = `pasio-padel-data-${new Date().toISOString().split('T')[0]}.json`
      downloadJson(data, filename)
    }
  })

  return (
    <div className="rounded-lg border p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">Mes données (RGPD)</h3>
          <p className="text-sm text-muted-foreground">
            Téléchargez une copie de vos données personnelles au format JSON.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            return exportMutation.mutate()
          }}
          disabled={exportMutation.isPending}
          aria-busy={exportMutation.isPending}
          className="shrink-0"
        >
          <DownloadIcon className="size-4" aria-hidden="true" />
          {exportMutation.isPending ? 'Préparation...' : 'Exporter mes données'}
        </Button>
      </div>
      {exportMutation.isError ? (
        <p role="alert" className="pt-4 text-sm text-destructive">
          {getErrorMessage(exportMutation.error)}
        </p>
      ) : null}
    </div>
  )
}
