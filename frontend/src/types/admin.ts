export type Role = 'ADMIN' | 'MOTORISTA'
export type StatusUsuario = 'TRIAL_ATIVO' | 'TRIAL_EXPIRADO' | 'ATIVO' | 'BLOQUEADO'
export type StatusAssinatura = 'AGUARDANDO_PAGAMENTO' | 'ATIVA' | 'EXPIRADA' | 'CANCELADA'

export interface Plano {
  id: number
  nome: string
  valorMensal: number
  limiteVeiculos: number
  descricaoFuncionalidades?: string
  ativo: boolean
}

export interface PlanoRequest {
  nome: string
  valorMensal: number
  limiteVeiculos: number
  descricaoFuncionalidades?: string
}

export interface Assinatura {
  id: number
  usuarioId: number
  usuarioNome: string
  planoId: number
  planoNome: string
  status: StatusAssinatura
  dataInicio: string
  dataExpiracao: string
  confirmadoPorNome?: string
  confirmadoEm?: string
}

export interface AdminUsuario {
  id: number
  nome: string
  email: string
  role: Role
  status: StatusUsuario
  dataInicioTrial?: string
  dataFimTrial?: string
  criadoEm: string
  assinaturaAtiva?: Assinatura
}

export interface AdminDashboard {
  totalUsuarios: number
  usuariosTrialAtivo: number
  usuariosAtivos: number
  usuariosBloqueados: number
  usuariosTrialExpirado: number
  receitaPotencial: number
}

export interface ConfirmarPagamentoRequest {
  usuarioId: number
  planoId: number
}
