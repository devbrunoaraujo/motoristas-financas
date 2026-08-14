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

export interface VeiculoRequest {
  apelido: string
  placa?: string
  tipoCombustivel: TipoCombustivel
  autonomia: number
  valorCompra?: number
  valorRevendaEstimado?: number
  dataAquisicao?: string
  kmAtual?: number
}

export interface VeiculoResponse {
  id: number
  apelido: string
  placa?: string
  tipoCombustivel: TipoCombustivel
  autonomia: number
  ativo: boolean
  valorCompra?: number
  valorRevendaEstimado?: number
  dataAquisicao?: string
  kmAtual?: number
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

export interface MetaRequest {
  metaMensal: number
}

export interface MetaResponse {
  id: number
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

export interface TrialInfo {
  diasRestantes: number
  dataFimTrial: string
  expirado: boolean
  whatsappAdmin: string
}

export type TipoManutencao = 'TROCA_OLEO' | 'PNEUS' | 'REVISAO' | 'FREIOS' | 'FILTROS' | 'ALINHAMENTO' | 'BATERIA' | 'OUTROS'

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
  alertarAposData: string
}

export interface AlertaManutencaoResponse {
  id: number
  veiculoId: number
  veiculoApelido: string
  tipo: TipoManutencao
  ativo: boolean
  alertarAposData: string
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
