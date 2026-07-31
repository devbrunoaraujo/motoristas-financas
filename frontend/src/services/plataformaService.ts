import { api } from './api'
import type { Plataforma, PlataformaRequest } from '../types/plataforma'

export async function listarPlataformas(): Promise<Plataforma[]> {
  const response = await api.get<Plataforma[]>('/admin/plataformas')
  return response.data
}

export async function listarPlataformasPublico(): Promise<Plataforma[]> {
  const response = await api.get<Plataforma[]>('/plataformas')
  return response.data
}

export async function criarPlataforma(dados: PlataformaRequest): Promise<Plataforma> {
  const response = await api.post<Plataforma>('/admin/plataformas', dados)
  return response.data
}

export async function editarPlataforma(id: number, dados: PlataformaRequest): Promise<Plataforma> {
  const response = await api.put<Plataforma>(`/admin/plataformas/${id}`, dados)
  return response.data
}

export async function inativarPlataforma(id: number): Promise<void> {
  await api.delete(`/admin/plataformas/${id}`)
}

export async function reativarPlataforma(id: number): Promise<void> {
  await api.put(`/admin/plataformas/${id}/reativar`)
}
