import { api } from './api'
import type { AdminDashboard, AdminUsuario, Assinatura, ConfirmarPagamentoRequest, Plano, PlanoRequest, AdminCriarUsuarioRequest, AdminEditarUsuarioRequest, Configuracao, ConfiguracaoRequest } from '../types/admin'

export async function getDashboard(): Promise<AdminDashboard> {
  const response = await api.get<AdminDashboard>('/admin/dashboard')
  return response.data
}

export async function listarUsuarios(): Promise<AdminUsuario[]> {
  const response = await api.get<AdminUsuario[]>('/admin/usuarios')
  return response.data
}

export async function criarUsuario(dados: AdminCriarUsuarioRequest): Promise<AdminUsuario> {
  const response = await api.post<AdminUsuario>('/admin/usuarios', dados)
  return response.data
}

export async function editarUsuario(id: number, dados: AdminEditarUsuarioRequest): Promise<AdminUsuario> {
  const response = await api.put<AdminUsuario>(`/admin/usuarios/${id}`, dados)
  return response.data
}

export async function inativarUsuario(id: number): Promise<AdminUsuario> {
  const response = await api.put<AdminUsuario>(`/admin/usuarios/${id}/inativar`)
  return response.data
}

export async function reativarUsuario(id: number): Promise<AdminUsuario> {
  const response = await api.put<AdminUsuario>(`/admin/usuarios/${id}/reativar`)
  return response.data
}

export async function confirmarPagamento(dados: ConfirmarPagamentoRequest): Promise<Assinatura> {
  const response = await api.post<Assinatura>('/admin/confirmar-pagamento', dados)
  return response.data
}

export async function alterarPlano(usuarioId: number, planoId: number): Promise<Assinatura> {
  const response = await api.put<Assinatura>(`/admin/usuarios/${usuarioId}/plano/${planoId}`)
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

export async function listarConfiguracoes(): Promise<Configuracao[]> {
  const response = await api.get<Configuracao[]>('/admin/configuracoes')
  return response.data
}

export async function salvarConfiguracao(chave: string, dados: ConfiguracaoRequest): Promise<Configuracao> {
  const response = await api.put<Configuracao>(`/admin/configuracoes/${chave}`, dados)
  return response.data
}
