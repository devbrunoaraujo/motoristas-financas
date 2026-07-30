export type TipoManutencao = 'TROCA_OLEO' | 'PNEUS' | 'REVISAO' | 'FREIOS' | 'FILTROS' | 'ALINHAMENTO' | 'BATERIA' | 'OUTROS'

export interface ManutencaoRequest {
  tipo: TipoManutencao
  descricao?: string
  kmReferencia: number
  data: string
  valor: number
  proximoKm?: number
  proximaData?: string
}

export interface ManutencaoResponse {
  id: number
  veiculoId: number
  veiculoApelido: string
  tipo: TipoManutencao
  descricao?: string
  kmReferencia: number
  data: string
  valor: number
  proximoKm?: number
  proximaData?: string
}

export interface AlertaManutencaoRequest {
  tipo: TipoManutencao
  alertarAposKm?: number
  alertarAposData?: string
}

export interface AlertaManutencaoResponse {
  id: number
  veiculoId: number
  veiculoApelido: string
  tipo: TipoManutencao
  ativo: boolean
  alertarAposKm?: number
  alertarAposData?: string
}

export interface DepreciacaoResponse {
  veiculoId: number
  veiculoApelido: string
  valorCompra?: number
  valorRevendaEstimado?: number
  dataAquisicao?: string
  depreciacaoTotal: number
  depreciacaoDiaria: number
  valorAtualEstimado?: number
  diasDesdeAquisicao: number
}
