export interface Plataforma {
  id: number
  nome: string
  descricao?: string
  ativo: boolean
}

export interface PlataformaRequest {
  nome: string
  descricao?: string
}
