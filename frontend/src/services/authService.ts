import { api } from './api'
import type { AuthResponse, CadastroRequest, LoginRequest } from '../types/usuario'
import type { TrialInfo } from '../types/admin'

export async function cadastro(dados: CadastroRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/cadastro', dados)
  return response.data
}

export async function login(dados: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', dados)
  return response.data
}

export async function getTrialInfo(): Promise<TrialInfo> {
  const response = await api.get<TrialInfo>('/auth/trial-info')
  return response.data
}

export async function getWhatsAppAdmin(): Promise<string> {
  const response = await api.get<string>('/configuracoes/chave/whatsapp_admin', { baseURL: 'http://localhost:8080' })
  return response.data
}
