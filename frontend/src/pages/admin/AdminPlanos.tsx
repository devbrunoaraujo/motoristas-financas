import { useState, useEffect } from 'react'
import * as adminService from '../../services/adminService'
import type { Plano, PlanoRequest } from '../../types/admin'
import { Card, Button, Input, PageHeader, EmptyState } from '../../components/ui'
import { CreditCard, Plus, Edit3, Trash2, Save, X } from 'lucide-react'

export default function AdminPlanos() {
  const [planos, setPlanos] = useState<Plano[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState<Plano | null>(null)

  const [nome, setNome] = useState('')
  const [valorMensal, setValorMensal] = useState('')
  const [limiteVeiculos, setLimiteVeiculos] = useState('1')
  const [descricao, setDescricao] = useState('')

  useEffect(() => { carregarPlanos() }, [])

  async function carregarPlanos() {
    try { setCarregando(true); setPlanos(await adminService.listarPlanos()) }
    catch { setErro('Erro ao carregar planos') } finally { setCarregando(false) }
  }

  function limparForm() {
    setNome(''); setValorMensal(''); setLimiteVeiculos('1'); setDescricao(''); setEditando(null); setMostrarForm(false)
  }

  function abrirEdicao(p: Plano) {
    setEditando(p); setNome(p.nome); setValorMensal(String(p.valorMensal))
    setLimiteVeiculos(String(p.limiteVeiculos)); setDescricao(p.descricaoFuncionalidades || ''); setMostrarForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro('')
    const dados: PlanoRequest = { nome, valorMensal: Number(valorMensal), limiteVeiculos: Number(limiteVeiculos), descricaoFuncionalidades: descricao || undefined }
    try {
      editando ? await adminService.atualizarPlano(editando.id, dados) : await adminService.criarPlano(dados)
      limparForm(); carregarPlanos()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  async function handleInativar(id: number) {
    if (!confirm('Inativar este plano?')) return
    try { await adminService.inativarPlano(id); carregarPlanos() } catch { setErro('Erro ao inativar') }
  }

  function fmtLimite(l: number) { return l === -1 ? 'Ilimitado' : String(l) }

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 600, margin: '0 auto' }}>
      <PageHeader title="Planos" action={
        !mostrarForm && <Button size="sm" onClick={() => setMostrarForm(true)}><Plus size={16} /> Novo</Button>
      } />

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{erro}</div>}

      {mostrarForm && (
        <Card style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-md)' }}>{editando ? 'Editar Plano' : 'Novo Plano'}</h2>
          <form onSubmit={handleSubmit}>
            <Input label="Nome" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Ex: Pro" />
            <Input label="Valor Mensal (R$)" type="number" step="0.01" min="0.01" value={valorMensal} onChange={e => setValorMensal(e.target.value)} required placeholder="Ex: 39.90" />
            <Input label="Limite de Veículos (-1 = ilimitado)" type="number" min="-1" value={limiteVeiculos} onChange={e => setLimiteVeiculos(e.target.value)} required />
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Descrição</label>
              <textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={3}
                style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 15, outline: 'none', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="submit" fullWidth><Save size={16} /> {editando ? 'Salvar' : 'Criar'}</Button>
              <Button variant="ghost" onClick={limparForm}><X size={16} /></Button>
            </div>
          </form>
        </Card>
      )}

      {planos.length === 0 && !mostrarForm ? (
        <EmptyState icon={<CreditCard size={48} />} title="Nenhum plano" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {planos.map((p, i) => (
            <Card key={p.id} style={{ animationDelay: `${i * 50}ms`, opacity: p.ativo ? 1 : 0.6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 600 }}>{p.nome}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{fmtLimite(p.limiteVeiculos)} veículo(s)</p>
                  {p.descricaoFuncionalidades && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{p.descricaoFuncionalidades}</p>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>R$ {p.valorMensal}</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => abrirEdicao(p)} style={{ padding: 6, background: 'var(--bg-input)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}><Edit3 size={14} /></button>
                    {p.ativo && <button onClick={() => handleInativar(p.id)} style={{ padding: 6, background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={14} /></button>}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
