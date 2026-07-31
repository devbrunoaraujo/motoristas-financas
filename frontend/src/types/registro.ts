export interface GanhoPlataformaRequest {
  plataformaId: number
  valor: number
}

export interface RegistroDiaRequest {
  veiculoId: number
  data: string
  kmRodado: number
  ganhos: GanhoPlataformaRequest[]
}

export interface GanhoPlataformaResponse {
  id: number
  plataformaId: number
  plataformaNome: string
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
