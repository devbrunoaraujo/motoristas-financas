export type Plataforma = 'UBER' | 'NOVENTA_E_NOVE' | 'IFOOD' | 'INDRIVE' | 'OUTRA'

export interface GanhoPlataformaRequest {
  plataforma: Plataforma
  valor: number
}

export interface RegistroDiaRequest {
  veiculoId: number
  kmRodado: number
  ganhos: GanhoPlataformaRequest[]
}

export interface GanhoPlataformaResponse {
  id: number
  plataforma: Plataforma
  valor: number
}

export interface RegistroDiaResponse {
  id: number
  veiculoId: number
  veiculoApelido: string
  data: string
  kmRodado: number
  ganhoBrutoTotal: number
  gastoCombustivelCalculado: number
  lucroLiquido: number
  ganhos: GanhoPlataformaResponse[]
}
