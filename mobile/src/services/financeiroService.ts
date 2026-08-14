import { api } from '../api/api'
import type { CustoFixoRequest, CustoFixoResponse, PontoEquilibrioResponse } from '../types'

export async function listarCustosFixos(): Promise<CustoFixoResponse[]> {
  const response = await api.get<CustoFixoResponse[]>('/financeiro/custos-fixos')
  return response.data
}

export async function criarCustoFixo(dados: CustoFixoRequest): Promise<CustoFixoResponse> {
  const response = await api.post<CustoFixoResponse>('/financeiro/custos-fixos', dados)
  return response.data
}

export async function excluirCustoFixo(id: number): Promise<void> {
  await api.delete(`/financeiro/custos-fixos/${id}`)
}

export async function getPontoEquilibrio(): Promise<PontoEquilibrioResponse> {
  const response = await api.get<PontoEquilibrioResponse>('/financeiro/ponto-equilibrio')
  return response.data
}
