import { api } from './api'
import type { Notificacao } from '../types/notificacao'

export async function listarNotificacoes(): Promise<Notificacao[]> {
  const response = await api.get<Notificacao[]>('/notificacoes')
  return response.data
}

export async function contarNaoLidas(): Promise<number> {
  const response = await api.get<number>('/notificacoes/count')
  return response.data
}

export async function marcarComoLida(id: number): Promise<void> {
  await api.put(`/notificacoes/${id}/ler`)
}

export async function marcarTodasComoLidas(): Promise<void> {
  await api.put('/notificacoes/ler-todas')
}
