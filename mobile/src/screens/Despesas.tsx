import { useState, useEffect } from 'react'
import { api } from '../api/api'
import { Card, Button, Input, Loading, EmptyState, colors } from '../components/ui'
import type { DespesaResponse, CategoriaDespesa } from '../types'

const CATEGORIAS: { value: CategoriaDespesa; label: string }[] = [
  { value: 'MANUTENCAO', label: 'Manutenção' }, { value: 'ALIMENTACAO', label: 'Alimentação' },
  { value: 'LIMPEZA', label: 'Limpeza' }, { value: 'SEGURO', label: 'Seguro' }, { value: 'OUTROS', label: 'Outros' },
]

export default function Despesas() {
  const [despesas, setDespesas] = useState<DespesaResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)

  const [categoria, setCategoria] = useState<CategoriaDespesa>('OUTROS')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => { carregarDespesas() }, [])

  async function carregarDespesas() {
    try { const r = await api.get('/despesas'); setDespesas(r.data) } catch {} finally { setCarregando(false) }
  }

  async function handleSubmit() {
    try {
      await api.post('/despesas', { categoria, descricao: descricao || undefined, valor: Number(valor), data })
      setMostrarForm(false); setDescricao(''); setValor(''); carregarDespesas()
    } catch (err: any) { alert(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  async function handleExcluir(id: number) {
    if (confirm('Excluir esta despesa?')) {
      await api.delete(`/despesas/${id}`); carregarDespesas()
    }
  }

  function fmtMoeda(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
  function fmtData(d: string) { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') }

  if (carregando) return <Loading />

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>Despesas</h1>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={{ background: colors.accent, padding: 10, borderRadius: 10, border: 'none', cursor: 'pointer', color: '#fff', fontSize: 20 }}>+</button>
      </div>

      {mostrarForm && (
        <Card style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Nova Despesa</h2>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textSecondary, marginBottom: 6 }}>Categoria</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value as CategoriaDespesa)} style={{
              width: '100%', padding: '14px', background: colors.input, border: `1px solid ${colors.border}`,
              borderRadius: 12, color: colors.text, fontSize: 15, outline: 'none',
            }}>
              {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <Input label="Descrição (opcional)" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Troca de óleo" />
          <Input label="Valor (R$)" value={valor} onChange={e => setValor(e.target.value)} placeholder="Ex: 150.00" type="number" />
          <Input label="Data" value={data} onChange={e => setData(e.target.value)} type="date" />
          <Button onClick={handleSubmit}>Cadastrar</Button>
        </Card>
      )}

      {despesas.length === 0 ? (
        <EmptyState icon="📋" title="Nenhuma despesa" description="Registre suas despesas" />
      ) : (
        despesas.map(d => (
          <Card key={d.id} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{d.categoria}</p>
                {d.descricao && <p style={{ fontSize: 13, color: colors.textMuted }}>{d.descricao}</p>}
                <p style={{ fontSize: 12, color: colors.textMuted }}>{fmtData(d.data)}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: colors.danger }}>{fmtMoeda(d.valor)}</p>
                <button onClick={() => handleExcluir(d.id)} style={{ background: 'none', border: 'none', color: colors.danger, cursor: 'pointer', fontSize: 16 }}>🗑</button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
