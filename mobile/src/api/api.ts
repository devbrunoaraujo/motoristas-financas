import { CapacitorHttp } from '@capacitor/core'

const API_URL = 'http://10.0.0.230:8080'

function getToken(): string | null {
  return localStorage.getItem('token')
}

function handleAuthError(status: number) {
  if (status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    window.location.href = '/login'
  }
}

async function request<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  data?: unknown
): Promise<{ data: T }> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const options = {
    url: `${API_URL}${path}`,
    headers,
    data,
  }

  let response
  switch (method) {
    case 'GET':    response = await CapacitorHttp.get(options); break
    case 'POST':   response = await CapacitorHttp.post(options); break
    case 'PUT':    response = await CapacitorHttp.put(options); break
    case 'DELETE': response = await CapacitorHttp.delete(options); break
  }

  handleAuthError(response.status)

  if (response.status >= 400) {
    const error: any = new Error(`Request failed with status code ${response.status}`)
    error.response = { status: response.status, data: response.data }
    throw error
  }

  return { data: response.data as T }
}

export const api = {
  get:    <T = any>(path: string) => request<T>('GET', path),
  post:   <T = any>(path: string, data?: unknown) => request<T>('POST', path, data),
  put:    <T = any>(path: string, data?: unknown) => request<T>('PUT', path, data),
  delete: <T = any>(path: string) => request<T>('DELETE', path),
}
