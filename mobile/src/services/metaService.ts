import { api } from '../api/api'
import type { MetaRequest, MetaResponse, MetaProgresso } from '../types'

export async function getMeta(): Promise<MetaResponse | null> {
  try {
    const response = await api.get<MetaResponse>('/metas')
    return response.data
  } catch (err: any) {
    if (err.response?.status === 204) return null
    throw err
  }
}

export async function criarOuAtualizarMeta(dados: MetaRequest): Promise<MetaResponse> {
  const response = await api.post<MetaResponse>('/metas', dados)
  return response.data
}

export async function getProgresso(): Promise<MetaProgresso | null> {
  try {
    const response = await api.get<MetaProgresso>('/metas/progresso')
    return response.data
  } catch (err: any) {
    if (err.response?.status === 204) return null
    throw err
  }
}
