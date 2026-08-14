export async function exportarRelatorio(formato: 'xlsx' | 'pdf', mes?: number, ano?: number): Promise<void> {
  const params = new URLSearchParams()
  params.append('formato', formato)
  if (mes) params.append('mes', String(mes))
  if (ano) params.append('ano', String(ano))

  // For mobile, we'll open the URL in the system browser
  const url = `http://10.0.0.230:8080/relatorios/mensal?${params.toString()}`
  
  // Get the token for authentication
  const token = localStorage.getItem('token')
  
  // Create a link with authentication
  const link = document.createElement('a')
  link.href = token ? `${url}&token=${token}` : url
  link.target = '_blank'
  link.download = `relatorio.${formato}`
  
  document.body.appendChild(link)
  link.click()
  link.remove()
}
