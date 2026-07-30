export type TipoCombustivel = 'GASOLINA' | 'ETANOL' | 'DIESEL' | 'GNV' | 'ELETRICO'

export interface PrecoCombustivelRequest {
  tipoCombustivel: TipoCombustivel
  preco: number
  vigenteDesde: string
}

export interface PrecoCombustivelResponse {
  id: number
  tipoCombustivel: TipoCombustivel
  preco: number
  vigenteDesde: string
}
