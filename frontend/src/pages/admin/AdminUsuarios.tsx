import { useState, useEffect } from 'react'
import * as adminService from '../../services/adminService'
import type { AdminUsuario, Plano, Role } from '../../types/admin'
import { Card, Button, Select, PageHeader, Badge, EmptyState, Input } from '../../components/ui'
import { Users, CreditCard, Check, Edit3, UserX, UserCheck, Plus, X, Save } from 'lucide-react'

const ROLES: { value: Role; label: string }[] = [
  { value: 'MOTORISTA', label: 'Motorista' },
  { value: 'ADMIN', label: 'Admin' },
]

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([])
  const [planos, setPlanos] = useState<Plano[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [confirmando, setConfirmando] = useState<number | null>(null)
  const [planoSelecionado, setPlanoSelecionado] = useState<number>(0)
  const [filtro, setFiltro] = useState<string>('todos')
  const [busca, setBusca] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState<AdminUsuario | null>(null)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [role, setRole] = useState<Role>('MOTORISTA')
  const [alterandoPlano, setAlterandoPlano] = useState<number | null>(null)
  const [planoParaAlterar, setPlanoParaAlterar] = useState<number>(0)

  useEffect(() => { carregarDados() }, [])

  async function carregarDados() {
    try {
      setCarregando(true)
      const [u, p] = await Promise.all([adminService.listarUsuarios(), adminService.listarPlanos()])
      setUsuarios(u); setPlanos(p)
      if (p.length > 0 && planoSelecionado === 0) setPlanoSelecionado(p[0].id)
    } catch { setErro('Erro ao carregar dados') } finally { setCarregando(false) }
  }

  function limparForm() {
    setNome(''); setEmail(''); setSenha(''); setRole('MOTORISTA')
    setEditando(null); setMostrarForm(false); setErro(''); setSucesso('')
  }

  function abrirEdicao(u: AdminUsuario) {
    setEditando(u); setNome(u.nome); setEmail(u.email); setRole(u.role)
    setMostrarForm(true); setErro(''); setSucesso('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setSucesso('')
    try {
      if (editando) {
        await adminService.editarUsuario(editando.id, { nome, email, role })
        setSucesso('Usuário atualizado!')
      } else {
        await adminService.criarUsuario({ nome, email, senha, role })
        setSucesso('Usuário criado!')
      }
      limparForm(); carregarDados()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  async function handleInativar(id: number) {
    if (!confirm('Inativar este usuário?')) return
    try { await adminService.inativarUsuario(id); carregarDados() } catch { setErro('Erro ao inativar') }
  }

  async function handleReativar(id: number) {
    try { await adminService.reativarUsuario(id); carregarDados() } catch { setErro('Erro ao reativar') }
  }

  async function handleConfirmar(usuarioId: number) {
    if (!planoSelecionado) { setErro('Selecione um plano'); return }
    try { await adminService.confirmarPagamento({ usuarioId, planoId: planoSelecionado }); setConfirmando(null); carregarDados() }
    catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao confirmar') }
  }

  async function handleAlterarPlano(usuarioId: number) {
    if (!planoParaAlterar) { setErro('Selecione um plano'); return }
    try { await adminService.alterarPlano(usuarioId, planoParaAlterar); setAlterandoPlano(null); setSucesso('Plano alterado!'); carregarDados() }
    catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao alterar plano') }
  }

  function fmtData(d?: string) { return d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '—' }

  function calcularDiasRestantes(dataFim?: string): number | null {
    if (!dataFim) return null
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const fim = new Date(dataFim + 'T00:00:00')
    const diff = Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const statusBadge: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }> = {
    TRIAL_ATIVO: { label: 'Trial Ativo', variant: 'success' },
    TRIAL_EXPIRADO: { label: 'Trial Expirado', variant: 'warning' },
    ATIVO: { label: 'Ativo', variant: 'info' },
    BLOQUEADO: { label: 'Bloqueado', variant: 'danger' },
  }

  const usuariosFiltrados = usuarios.filter(u => {
    if (filtro !== 'todos' && u.status !== filtro) return false
    if (busca && !u.nome.toLowerCase().includes(busca.toLowerCase()) && !u.email.toLowerCase().includes(busca.toLowerCase())) return false
    return true
  })

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 700, margin: '0 auto' }}>
      <PageHeader title="Usuários" action={
        !mostrarForm && <Button size="sm" onClick={() => setMostrarForm(true)}><Plus size={16} /> Novo</Button>
      } />

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{erro}</div>}
      {sucesso && <div style={{ padding: '10px 14px', background: 'rgba(0,184,148,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{sucesso}</div>}

      {/* Formulário de criar/editar */}
      {mostrarForm && (
        <Card style={{ marginBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>{editando ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            <button onClick={limparForm} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <Input label="Nome" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Nome completo" />
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="email@exemplo.com" />
            {!editando && <Input label="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} required placeholder="Mínimo 6 caracteres" />}
            <Select label="Role" value={role} onChange={e => setRole(e.target.value as Role)} options={ROLES} />
            <Button type="submit" fullWidth><Save size={16} /> {editando ? 'Salvar' : 'Criar Usuário'}</Button>
          </form>
        </Card>
      )}

      {/* Filtros e busca */}
      <Card style={{ marginBottom: 'var(--space-md)', display: 'flex', gap: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por nome ou email..."
          style={{ flex: 1, minWidth: 180, padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { key: 'todos', label: 'Todos' },
            { key: 'TRIAL_ATIVO', label: 'Trial' },
            { key: 'ATIVO', label: 'Ativos' },
            { key: 'TRIAL_EXPIRADO', label: 'Expirados' },
            { key: 'BLOQUEADO', label: 'Bloqueados' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              style={{
                padding: '6px 12px', borderRadius: 'var(--radius-full)',
                background: filtro === f.key ? 'var(--accent)' : 'var(--bg-input)',
                color: filtro === f.key ? '#fff' : 'var(--text-secondary)',
                border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              }}
            >{f.label}</button>
          ))}
        </div>
      </Card>

      {/* Select plano para confirmação */}
      {planos.length > 0 && (
        <Card style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <CreditCard size={18} color="var(--accent)" />
          <Select value={planoSelecionado} onChange={e => setPlanoSelecionado(Number(e.target.value))}
            options={planos.map(p => ({ value: p.id, label: `${p.nome} — R$ ${p.valorMensal}` }))}
            style={{ marginBottom: 0, flex: 1 }} />
        </Card>
      )}

      {/* Lista de usuários */}
      {usuariosFiltrados.length === 0 ? (
        <EmptyState icon={<Users size={48} />} title="Nenhum usuário encontrado" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {usuariosFiltrados.map((u, i) => {
            const diasRestantes = calcularDiasRestantes(u.dataFimTrial)
            return (
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

                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                  <span>Trial: {fmtData(u.dataInicioTrial)} até {fmtData(u.dataFimTrial)}</span>
                  {diasRestantes !== null && u.status === 'TRIAL_ATIVO' && (
                    <span style={{
                      marginLeft: 8, fontWeight: 600,
                      color: diasRestantes <= 2 ? 'var(--danger)' : 'var(--accent)',
                    }}>
                      ({diasRestantes} {diasRestantes === 1 ? 'dia restante' : 'dias restantes'})
                    </span>
                  )}
                  {u.status === 'TRIAL_EXPIRADO' && diasRestantes !== null && diasRestantes <= 0 && (
                    <span style={{ marginLeft: 8, fontWeight: 600, color: 'var(--danger)' }}>
                      (expirado há {Math.abs(diasRestantes)} {Math.abs(diasRestantes) === 1 ? 'dia' : 'dias'})
                    </span>
                  )}
                  <span style={{ marginLeft: 8 }}>Cadastro: {fmtData(u.criadoEm)}</span>
                </div>

                {u.assinaturaAtiva && (
                  <div style={{ padding: 8, background: 'rgba(0,184,148,0.05)', borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 8 }}>
                    {u.assinaturaAtiva.planoNome} — {u.assinaturaAtiva.status} — Expira em {fmtData(u.assinaturaAtiva.dataExpiracao)}
                  </div>
                )}

                {/* Ações */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Button size="sm" variant="ghost" onClick={() => abrirEdicao(u)}>
                    <Edit3 size={14} /> Editar
                  </Button>

                  {u.status === 'BLOQUEADO' && (
                    <Button size="sm" onClick={() => handleReativar(u.id)}>
                      <UserCheck size={14} /> Reativar
                    </Button>
                  )}

                  {u.status !== 'BLOQUEADO' && (
                    <Button size="sm" variant="danger" onClick={() => handleInativar(u.id)}>
                      <UserX size={14} /> Inativar
                    </Button>
                  )}

                  {(u.status === 'TRIAL_EXPIRADO' || u.status === 'BLOQUEADO') && (
                    confirmando === u.id ? (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Button size="sm" onClick={() => handleConfirmar(u.id)}><Check size={14} /> Confirmar Pagamento</Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirmando(null)}>Cancelar</Button>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => setConfirmando(u.id)}>
                        <CreditCard size={14} /> Liberar Plano
                      </Button>
                    )
                  )}

                  {/* Alterar plano */}
                  {alterandoPlano === u.id ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <select
                        value={planoParaAlterar}
                        onChange={e => setPlanoParaAlterar(Number(e.target.value))}
                        style={{ padding: '6px 10px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 13 }}
                      >
                        {planos.map(p => <option key={p.id} value={p.id}>{p.nome} — R$ {p.valorMensal}</option>)}
                      </select>
                      <Button size="sm" onClick={() => handleAlterarPlano(u.id)}><Check size={14} /> Confirmar</Button>
                      <Button size="sm" variant="ghost" onClick={() => setAlterandoPlano(null)}>Cancelar</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => { setAlterandoPlano(u.id); setPlanoParaAlterar(planos[0]?.id || 0) }}>
                      <CreditCard size={14} /> Alterar Plano
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
