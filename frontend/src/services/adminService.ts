import { api } from './api'
import type { AdminDashboard, AdminUsuario, Assinatura, ConfirmarPagamentoRequest, Plano, PlanoRequest } from '../types/admin'

export async function getDashboard(): Promise<AdminDashboard> {
  const response = await api.get<AdminDashboard>('/admin/dashboard')
  return response.data
}

export async function listarUsuarios(): Promise<AdminUsuario[]> {
  const response = await api.get<AdminUsuario[]>('/admin/usuarios')
  return response.data
}

export async function confirmarPagamento(dados: ConfirmarPagamentoRequest): Promise<Assinatura> {
  const response = await api.post<Assinatura>('/admin/confirmar-pagamento', dados)
  return response.data
}

export async function listarPlanos(): Promise<Plano[]> {
  const response = await api.get<Plano[]>('/admin/planos')
  return response.data
}

export async function criarPlano(dados: PlanoRequest): Promise<Plano> {
  const response = await api.post<Plano>('/admin/planos', dados)
  return response.data
}

export async function atualizarPlano(id: number, dados: PlanoRequest): Promise<Plano> {
  const response = await api.put<Plano>(`/admin/planos/${id}`, dados)
  return response.data
}

export async function inativarPlano(id: number): Promise<void> {
  await api.delete(`/admin/planos/${id}`)
}
