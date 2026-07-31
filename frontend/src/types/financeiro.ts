export interface CustoFixoRequest {
  descricao: string
  valorMensal: number
}

export interface CustoFixoResponse {
  id: number
  descricao: string
  valorMensal: number
  ativo: boolean
}

export interface PontoEquilibrioResponse {
  custosFixosMensal: number
  custoVariavelMedioDia: number
  ganhoMedioDia: number
  pontoEquilibrioDia: number
  pontoEquilibrioMes: number
  margemAtual: number
  acimaDoPontoEquilibrio: boolean
}
