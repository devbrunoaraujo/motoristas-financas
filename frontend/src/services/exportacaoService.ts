import { api } from './api'

export async function exportarRelatorio(formato: 'xlsx' | 'pdf', mes?: number, ano?: number): Promise<void> {
  const params = new URLSearchParams()
  params.append('formato', formato)
  if (mes) params.append('mes', String(mes))
  if (ano) params.append('ano', String(ano))

  const response = await api.get(`/relatorios/mensal?${params.toString()}`, {
    responseType: 'blob'
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url

  const contentDisposition = response.headers['content-disposition']
  const fileName = contentDisposition
    ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
    : `relatorio.${formato}`

  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
