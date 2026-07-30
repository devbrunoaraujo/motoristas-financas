export type CategoriaDespesa = 'MANUTENCAO' | 'ALIMENTACAO' | 'LIMPEZA' | 'SEGURO' | 'OUTROS'

export interface DespesaRequest {
  categoria: CategoriaDespesa
  descricao?: string
  valor: number
  data: string
}

export interface DespesaResponse {
  id: number
  categoria: CategoriaDespesa
  descricao?: string
  valor: number
  data: string
}
