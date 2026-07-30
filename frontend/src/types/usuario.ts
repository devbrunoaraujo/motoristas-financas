export interface Usuario {
  id?: number
  nome: string
  email: string
  role: 'ADMIN' | 'MOTORISTA'
}

export interface AuthResponse {
  token: string
  nome: string
  email: string
  role: 'ADMIN' | 'MOTORISTA'
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
