export interface MetaRequest {
  metaDiaria: number
  metaSemanal: number
  metaMensal: number
}

export interface MetaResponse {
  id: number
  metaDiaria: number
  metaSemanal: number
  metaMensal: number
  vigenteDesde: string
}

export interface MetaProgresso {
  metaDiaria: number
  realizadoDiaria: number
  percentualDiaria: number
  metaSemanal: number
  realizadoSemanal: number
  percentualSemanal: number
  metaMensal: number
  realizadoMensal: number
  percentualMensal: number
}
