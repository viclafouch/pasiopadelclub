import { createClientOnlyFn } from '@tanstack/react-start'

type DownloadFileParams = {
  content: Blob
  filename: string
}

export const downloadFile = createClientOnlyFn(
  ({ content, filename }: DownloadFileParams) => {
    const url = URL.createObjectURL(content)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
)

export const downloadJson = createClientOnlyFn(
  (data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })
    downloadFile({ content: blob, filename })
  }
)
