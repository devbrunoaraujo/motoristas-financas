import { api } from './api'
import type { MetaRequest, MetaResponse, MetaProgresso } from '../types/meta'

export async function getMeta(): Promise<MetaResponse | null> {
  const response = await api.get<MetaResponse>('/metas')
  return response.status === 204 ? null : response.data
}

export async function criarOuAtualizarMeta(dados: MetaRequest): Promise<MetaResponse> {
  const response = await api.post<MetaResponse>('/metas', dados)
  return response.data
}

export async function getProgresso(): Promise<MetaProgresso | null> {
  const response = await api.get<MetaProgresso>('/metas/progresso')
  return response.status === 204 ? null : response.data
}
