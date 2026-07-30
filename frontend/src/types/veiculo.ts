export type TipoCombustivel = 'GASOLINA' | 'ETANOL' | 'DIESEL' | 'GNV' | 'ELETRICO'

export interface VeiculoRequest {
  apelido: string
  placa?: string
  tipoCombustivel: TipoCombustivel
  autonomia: number
}

export interface VeiculoResponse {
  id: number
  apelido: string
  placa?: string
  tipoCombustivel: TipoCombustivel
  autonomia: number
  ativo: boolean
}
