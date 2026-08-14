import { api } from '../api/api'
import type { AuthResponse, TrialInfo } from '../types'

export async function login(email: string, senha: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', { email, senha })
  return response.data
}

export async function cadastro(nome: string, email: string, senha: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/cadastro', { nome, email, senha })
  return response.data
}

export async function getTrialInfo(): Promise<TrialInfo> {
  const response = await api.get<TrialInfo>('/auth/trial-info')
  return response.data
}
