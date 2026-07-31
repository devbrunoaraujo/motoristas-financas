import { api } from './api'
import type { IniciarTurnoRequest, FinalizarTurnoRequest, TurnoResponse, AnalisePlataforma } from '../types/turno'

export async function listarTurnos(): Promise<TurnoResponse[]> {
  const response = await api.get<TurnoResponse[]>('/turnos')
  return response.data
}

export async function getTurnoAtivo(): Promise<TurnoResponse | null> {
  const response = await api.get<TurnoResponse>('/turnos/ativo')
  return response.status === 204 ? null : response.data
}

export async function iniciarTurno(dados: IniciarTurnoRequest): Promise<TurnoResponse> {
  const response = await api.post<TurnoResponse>('/turnos/iniciar', dados)
  return response.data
}

export async function finalizarTurno(id: number, dados: FinalizarTurnoRequest): Promise<TurnoResponse> {
  const response = await api.put<TurnoResponse>(`/turnos/${id}/finalizar`, dados)
  return response.data
}

export async function excluirTurno(id: number): Promise<void> {
  await api.delete(`/turnos/${id}`)
}

export async function getAnalisePlataformas(dias: number = 30): Promise<AnalisePlataforma[]> {
  const response = await api.get<AnalisePlataforma[]>(`/turnos/analise-plataformas?dias=${dias}`)
  return response.data
}
