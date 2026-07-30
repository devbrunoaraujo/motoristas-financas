import { api } from './api'
import type { RegistroDiaRequest, RegistroDiaResponse } from '../types/registro'

export async function listarRegistros(): Promise<RegistroDiaResponse[]> {
  const response = await api.get<RegistroDiaResponse[]>('/registros')
  return response.data
}

export async function criarRegistro(dados: RegistroDiaRequest): Promise<RegistroDiaResponse> {
  const response = await api.post<RegistroDiaResponse>('/registros', dados)
  return response.data
}

export async function excluirRegistro(id: number): Promise<void> {
  await api.delete(`/registros/${id}`)
}
