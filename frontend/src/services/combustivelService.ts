import { api } from './api'
import type { PrecoCombustivelRequest, PrecoCombustivelResponse } from '../types/combustivel'

export async function listarPrecos(): Promise<PrecoCombustivelResponse[]> {
  const response = await api.get<PrecoCombustivelResponse[]>('/combustivel')
  return response.data
}

export async function criarPreco(dados: PrecoCombustivelRequest): Promise<PrecoCombustivelResponse> {
  const response = await api.post<PrecoCombustivelResponse>('/combustivel', dados)
  return response.data
}

export async function excluirPreco(id: number): Promise<void> {
  await api.delete(`/combustivel/${id}`)
}
