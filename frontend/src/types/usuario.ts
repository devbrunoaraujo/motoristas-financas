export type StatusUsuario = 'TRIAL_ATIVO' | 'TRIAL_EXPIRADO' | 'ATIVO' | 'BLOQUEADO'

export interface Usuario {
  id?: number
  nome: string
  email: string
  role: 'ADMIN' | 'MOTORISTA'
  status?: StatusUsuario
}

export interface AuthResponse {
  token: string
  nome: string
  email: string
  role: 'ADMIN' | 'MOTORISTA'
  status?: StatusUsuario
}

export interface CadastroRequest {
  nome: string
  email: string
  senha: string
}

export interface LoginRequest {
  email: string
  senha: string
}
