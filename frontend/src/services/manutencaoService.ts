import { api } from './api'
import type { ManutencaoRequest, ManutencaoResponse, AlertaManutencaoRequest, AlertaManutencaoResponse, DepreciacaoResponse } from '../types/manutencao'

export async function listarManutencoes(veiculoId: number): Promise<ManutencaoResponse[]> {
  const response = await api.get<ManutencaoResponse[]>(`/veiculos/${veiculoId}/manutencoes`)
  return response.data
}

export async function listarHistoricoCompleto(): Promise<ManutencaoResponse[]> {
  const response = await api.get<ManutencaoResponse[]>('/manutencao/historico')
  return response.data
}

export async function criarManutencao(veiculoId: number, dados: ManutencaoRequest): Promise<ManutencaoResponse> {
  const response = await api.post<ManutencaoResponse>(`/veiculos/${veiculoId}/manutencoes`, dados)
  return response.data
}

export async function excluirManutencao(veiculoId: number, id: number): Promise<void> {
  await api.delete(`/veiculos/${veiculoId}/manutencoes/${id}`)
}

export async function listarAlertas(): Promise<AlertaManutencaoResponse[]> {
  const response = await api.get<AlertaManutencaoResponse[]>('/manutencao/alertas')
  return response.data
}

export async function criarAlerta(veiculoId: number, dados: AlertaManutencaoRequest): Promise<AlertaManutencaoResponse> {
  const response = await api.post<AlertaManutencaoResponse>(`/veiculos/${veiculoId}/alertas`, dados)
  return response.data
}

export async function desativarAlerta(veiculoId: number, id: number): Promise<void> {
  await api.delete(`/veiculos/${veiculoId}/alertas/${id}`)
}

export async function getDepreciacoes(): Promise<DepreciacaoResponse[]> {
  const response = await api.get<DepreciacaoResponse[]>('/depreciacao')
  return response.data
}
