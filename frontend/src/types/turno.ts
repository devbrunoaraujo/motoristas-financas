export interface IniciarTurnoRequest {
  veiculoId: number
  kmInicio: number
}

export interface FinalizarTurnoRequest {
  kmFim: number
}

export interface TurnoResponse {
  id: number
  veiculoId: number
  veiculoApelido: string
  data: string
  horaInicio: string
  horaFim?: string
  kmInicio: number
  kmFim?: number
  kmRodado: number
  ganhoBruto?: number
  gastoCombustivel?: number
  lucroLiquido?: number
  lucroPorKm?: number
  lucroPorHora?: number
  ganhoPorHora?: number
  emAndamento: boolean
}

export interface AnalisePlataforma {
  plataforma: string
  ganhoTotal: number
  percentualDoTotal: number
  ganhoMedioPorDia: number
  diasTrabalhados: number
}
