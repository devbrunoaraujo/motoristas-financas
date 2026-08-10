export type Role = 'ADMIN' | 'MOTORISTA'
export type StatusUsuario = 'TRIAL_ATIVO' | 'TRIAL_EXPIRADO' | 'ATIVO' | 'BLOQUEADO'
export type TipoCombustivel = 'GASOLINA' | 'ETANOL' | 'DIESEL' | 'GNV' | 'ELETRICO'
export type CategoriaDespesa = 'MANUTENCAO' | 'ALIMENTACAO' | 'LIMPEZA' | 'SEGURO' | 'OUTROS'

export interface AuthResponse {
  token: string
  nome: string
  email: string
  role: Role
  status?: StatusUsuario
}

export interface DashboardResponse {
  ganhoBrutoDia: number
  ganhoBrutoSemana: number
  ganhoBrutoMes: number
  gastoCombustivelDia: number
  gastoCombustivelSemana: number
  gastoCombustivelMes: number
  despesasMes: number
  lucroLiquidoDia: number
  lucroLiquidoSemana: number
  lucroLiquidoMes: number
  kmTotalRodado: number
  ganhoMedioPorKm: number
  custoCombustivelPorKm: number
  ganhoBrutoPorKm: number
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
  ganhos: { id: number; plataformaId: number; plataformaNome: string; valor: number }[]
}

export interface VeiculoResponse {
  id: number
  apelido: string
  placa?: string
  tipoCombustivel: TipoCombustivel
  autonomia: number
  ativo: boolean
}

export interface Plataforma {
  id: number
  nome: string
  descricao?: string
  ativo: boolean
}

export interface DespesaResponse {
  id: number
  categoria: CategoriaDespesa
  descricao?: string
  valor: number
  data: string
}

export interface Plano {
  id: number
  nome: string
  valorMensal: number
}

export interface PrecoCombustivelResponse {
  id: number
  tipoCombustivel: TipoCombustivel
  preco: number
  vigenteDesde: string
}
