import { api } from './api'
import type { DespesaRequest, DespesaResponse } from '../types/despesa'

export async function listarDespesas(): Promise<DespesaResponse[]> {
  const response = await api.get<DespesaResponse[]>('/despesas')
  return response.data
}

export async function criarDespesa(dados: DespesaRequest): Promise<DespesaResponse> {
  const response = await api.post<DespesaResponse>('/despesas', dados)
  return response.data
}

export async function atualizarDespesa(id: number, dados: DespesaRequest): Promise<DespesaResponse> {
  const response = await api.put<DespesaResponse>(`/despesas/${id}`, dados)
  return response.data
}

export async function excluirDespesa(id: number): Promise<void> {
  await api.delete(`/despesas/${id}`)
}
