import axios from 'axios'

// Toda chamada HTTP para o backend deve passar por esta instância,
// nunca chamar fetch/axios diretamente dentro de componentes.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
