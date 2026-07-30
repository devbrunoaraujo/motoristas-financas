import { api } from './api'
import type { AuthResponse, CadastroRequest, LoginRequest } from '../types/usuario'

export async function cadastro(dados: CadastroRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/cadastro', dados)
  return response.data
}

export async function login(dados: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', dados)
  return response.data
}
