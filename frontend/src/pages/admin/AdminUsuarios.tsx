import { useState, useEffect } from 'react'
import * as adminService from '../../services/adminService'
import type { AdminUsuario, Plano } from '../../types/admin'
import { Card, Button, Select, PageHeader, Badge, EmptyState } from '../../components/ui'
import { Users, CreditCard, Check } from 'lucide-react'

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([])
  const [planos, setPlanos] = useState<Plano[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [confirmando, setConfirmando] = useState<number | null>(null)
  const [planoSelecionado, setPlanoSelecionado] = useState<number>(0)

  useEffect(() => { carregarDados() }, [])

  async function carregarDados() {
    try {
      setCarregando(true)
      const [u, p] = await Promise.all([adminService.listarUsuarios(), adminService.listarPlanos()])
      setUsuarios(u); setPlanos(p)
      if (p.length > 0 && planoSelecionado === 0) setPlanoSelecionado(p[0].id)
    } catch { setErro('Erro ao carregar dados') } finally { setCarregando(false) }
  }

  async function handleConfirmar(usuarioId: number) {
    if (!planoSelecionado) { setErro('Selecione um plano'); return }
    try { await adminService.confirmarPagamento({ usuarioId, planoId: planoSelecionado }); setConfirmando(null); carregarDados() }
    catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao confirmar') }
  }

  function fmtData(d?: string) { return d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '—' }

  const statusBadge: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }> = {
    TRIAL_ATIVO: { label: 'Trial Ativo', variant: 'success' },
    TRIAL_EXPIRADO: { label: 'Trial Expirado', variant: 'warning' },
    ATIVO: { label: 'Ativo', variant: 'info' },
    BLOQUEADO: { label: 'Bloqueado', variant: 'danger' },
  }

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 700, margin: '0 auto' }}>
      <PageHeader title="Usuários" />

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{erro}</div>}

      {planos.length > 0 && (
        <Card style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <CreditCard size={18} color="var(--accent)" />
          <Select value={planoSelecionado} onChange={e => setPlanoSelecionado(Number(e.target.value))}
            options={planos.map(p => ({ value: p.id, label: `${p.nome} — R$ ${p.valorMensal}` }))}
            style={{ marginBottom: 0, flex: 1 }} />
        </Card>
      )}

      {usuarios.length === 0 ? (
        <EmptyState icon={<Users size={48} />} title="Nenhum usuário" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {usuarios.map((u, i) => (
            <Card key={u.id} style={{ animationDelay: `${i * 50}ms` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{u.nome}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{u.email}</p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Badge variant={statusBadge[u.status]?.variant || 'default'}>{statusBadge[u.status]?.label || u.status}</Badge>
                  <Badge>{u.role}</Badge>
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                Trial: {fmtData(u.dataInicioTrial)} até {fmtData(u.dataFimTrial)} • Cadastro: {fmtData(u.criadoEm)}
              </p>
              {u.assinaturaAtiva && (
                <div style={{ padding: 8, background: 'rgba(0,184,148,0.05)', borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 8 }}>
                  {u.assinaturaAtiva.planoNome} — {u.assinaturaAtiva.status} — Expira em {fmtData(u.assinaturaAtiva.dataExpiracao)}
                </div>
              )}
              {(u.status === 'TRIAL_EXPIRADO' || u.status === 'BLOQUEADO') && (
                confirmando === u.id ? (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Confirmar pagamento?</span>
                    <Button size="sm" onClick={() => handleConfirmar(u.id)}><Check size={14} /> Sim</Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmando(null)}>Não</Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => setConfirmando(u.id)}>
                    <CreditCard size={14} /> Confirmar Pagamento
                  </Button>
                )
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
