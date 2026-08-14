import { api } from '../api/api'
import type { VeiculoRequest, VeiculoResponse } from '../types'

export async function listarVeiculos(): Promise<VeiculoResponse[]> {
  const response = await api.get<VeiculoResponse[]>('/veiculos')
  return response.data
}

export async function criarVeiculo(dados: VeiculoRequest): Promise<VeiculoResponse> {
  const response = await api.post<VeiculoResponse>('/veiculos', dados)
  return response.data
}

export async function atualizarVeiculo(id: number, dados: VeiculoRequest): Promise<VeiculoResponse> {
  const response = await api.put<VeiculoResponse>(`/veiculos/${id}`, dados)
  return response.data
}

export async function inativarVeiculo(id: number): Promise<void> {
  await api.delete(`/veiculos/${id}`)
}
