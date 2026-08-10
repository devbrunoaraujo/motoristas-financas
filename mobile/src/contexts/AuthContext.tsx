import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../api/api'
import type { AuthResponse, Role, StatusUsuario } from '../types'

interface Usuario {
  nome: string
  email: string
  role: Role
  status?: StatusUsuario
}

interface AuthContextData {
  usuario: Usuario | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, senha: string) => Promise<void>
  cadastro: (nome: string, email: string, senha: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStoredAuth()
  }, [])

  async function loadStoredAuth() {
    try {
      const storedUser = localStorage.getItem('usuario')
      if (storedUser) {
        setUsuario(JSON.parse(storedUser))
      }
    } finally {
      setIsLoading(false)
    }
  }

  function saveAuth(data: AuthResponse) {
    const user: Usuario = {
      nome: data.nome,
      email: data.email,
      role: data.role,
      status: data.status,
    }
    setUsuario(user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('usuario', JSON.stringify(user))
  }

  async function login(email: string, senha: string) {
    const response = await api.post<AuthResponse>('/auth/login', { email, senha })
    saveAuth(response.data)
  }

  async function cadastro(nome: string, email: string, senha: string) {
    const response = await api.post<AuthResponse>('/auth/cadastro', { nome, email, senha })
    saveAuth(response.data)
  }

  async function logout() {
    setUsuario(null)
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      isAuthenticated: !!usuario,
      isLoading,
      login,
      cadastro,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
