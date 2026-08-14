import { api } from '../api/api'
import type { DashboardResponse } from '../types'

export interface DiaResumo {
  data: string
  ganhoBruto: number
  gastoCombustivel: number
  lucroLiquido: number
  percentualGanho: number
  percentualCombustivel: number
}

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await api.get<DashboardResponse>('/dashboard')
  return response.data
}

export async function getUltimosDias(dias: number = 7): Promise<DiaResumo[]> {
  const response = await api.get<DiaResumo[]>(`/dashboard/ultimos-dias?dias=${dias}`)
  return response.data
}
