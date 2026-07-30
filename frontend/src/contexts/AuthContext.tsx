import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { AuthResponse, CadastroRequest, LoginRequest, Usuario } from '../types/usuario'
import * as authService from '../services/authService'

interface AuthContextData {
  usuario: Usuario | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (dados: LoginRequest) => Promise<void>
  cadastro: (dados: CadastroRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('usuario')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUsuario(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  function saveAuth(data: AuthResponse) {
    const user: Usuario = {
      nome: data.nome,
      email: data.email,
      role: data.role
    }

    setToken(data.token)
    setUsuario(user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('usuario', JSON.stringify(user))
  }

  async function login(dados: LoginRequest) {
    const data = await authService.login(dados)
    saveAuth(data)
  }

  async function cadastro(dados: CadastroRequest) {
    const data = await authService.cadastro(dados)
    saveAuth(data)
  }

  function logout() {
    setToken(null)
    setUsuario(null)
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      cadastro,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
