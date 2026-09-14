import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as despesaService from '../../services/despesaService'
import type { DespesaRequest, DespesaResponse, CategoriaDespesa } from '../../types/despesa'
import { Card, Button, Input, Select, EmptyState } from '../../components/ui'
import { Receipt, Plus, Edit3, Trash2, Save, X } from 'lucide-react'

const CATEGORIAS: { value: CategoriaDespesa; label: string }[] = [
  { value: 'MANUTENCAO', label: 'Manutenção' }, { value: 'ALIMENTACAO', label: 'Alimentação' },
  { value: 'LIMPEZA', label: 'Limpeza' }, { value: 'SEGURO', label: 'Seguro' }, { value: 'OUTROS', label: 'Outros' },
]

export default function Despesas() {
  const [despesas, setDespesas] = useState<DespesaResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState<DespesaResponse | null>(null)

  const [categoria, setCategoria] = useState<CategoriaDespesa>('OUTROS')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => { carregarDespesas() }, [])

  async function carregarDespesas() {
    try { setCarregando(true); setDespesas(await despesaService.listarDespesas()) }
    catch { setErro('Erro ao carregar despesas') } finally { setCarregando(false) }
  }

  function limparForm() {
    setCategoria('OUTROS'); setDescricao(''); setValor(''); setData(new Date().toISOString().split('T')[0])
    setEditando(null); setMostrarForm(false)
  }

  function abrirEdicao(d: DespesaResponse) {
    setEditando(d); setCategoria(d.categoria); setDescricao(d.descricao || '')
    setValor(String(d.valor)); setData(d.data); setMostrarForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro('')
    const dados: DespesaRequest = { categoria, descricao: descricao || undefined, valor: Number(valor), data }
    try {
      editando ? await despesaService.atualizarDespesa(editando.id, dados) : await despesaService.criarDespesa(dados)
      limparForm(); carregarDespesas()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Excluir esta despesa?')) return
    try { await despesaService.excluirDespesa(id); carregarDespesas() } catch { setErro('Erro ao excluir') }
  }

  function fmtMoeda(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
  function fmtData(d: string) { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') }

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-lg)' }}>
        <Link to="/registros" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, flex: 1 }}>Despesas</h1>
        {!mostrarForm && <Button size="sm" onClick={() => setMostrarForm(true)}><Plus size={16} /> Nova</Button>}
      </div>

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{erro}</div>}

      {mostrarForm && (
        <Card style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-md)' }}>{editando ? 'Editar Despesa' : 'Nova Despesa'}</h2>
          <form onSubmit={handleSubmit}>
            <Select label="Categoria" value={categoria} onChange={e => setCategoria(e.target.value as CategoriaDespesa)} options={CATEGORIAS} />
            <Input label="Descrição (opcional)" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Troca de óleo" />
            <Input label="Valor (R$)" type="number" step="0.01" min="0.01" value={valor} onChange={e => setValor(e.target.value)} required placeholder="Ex: 150.00" />
            <Input label="Data" type="date" value={data} onChange={e => setData(e.target.value)} required />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="submit" fullWidth><Save size={16} /> {editando ? 'Salvar' : 'Cadastrar'}</Button>
              <Button variant="ghost" onClick={limparForm}><X size={16} /></Button>
            </div>
          </form>
        </Card>
      )}

      {despesas.length === 0 && !mostrarForm ? (
        <EmptyState icon={<Receipt size={48} />} title="Nenhuma despesa" description="Registre suas despesas" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {despesas.map((d, i) => (
            <Card key={d.id} style={{ animationDelay: `${i * 50}ms` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{d.categoria}</p>
                  {d.descricao && <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{d.descricao}</p>}
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{fmtData(d.data)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--danger)' }}>{fmtMoeda(d.valor)}</p>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => abrirEdicao(d)} style={{ padding: 6, background: 'var(--bg-input)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}><Edit3 size={14} /></button>
                    <button onClick={() => handleExcluir(d.id)} style={{ padding: 6, background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={14} /></button>
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
