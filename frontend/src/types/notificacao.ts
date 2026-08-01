export type TipoNotificacao = 'LUCRO_BAIXO' | 'META_ATINGIDA' | 'MANUTENCAO_PROXIMA' | 'TRIAL_EXPIRANDO' | 'LEMBRETE'

export interface Notificacao {
  id: number
  tipo: TipoNotificacao
  titulo: string
  mensagem: string
  lida: boolean
  criadaEm: string
}
