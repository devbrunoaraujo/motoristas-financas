import { useState, useEffect } from 'react'
import { api } from '../api/api'
import { Card, Button, Input, Loading, EmptyState, colors } from '../components/ui'
import type { PrecoCombustivelResponse } from '../types'

export default function Combustivel() {
  const [precos, setPrecos] = useState<PrecoCombustivelResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)

  const [tipoCombustivel, setTipoCombustivel] = useState('GASOLINA')
  const [preco, setPreco] = useState('')
  const [vigenteDesde, setVigenteDesde] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => { carregarPrecos() }, [])

  async function carregarPrecos() {
    try { const r = await api.get('/combustivel'); setPrecos(r.data) } catch {} finally { setCarregando(false) }
  }

  async function handleSubmit() {
    try {
      await api.post('/combustivel', { tipoCombustivel, preco: Number(preco), vigenteDesde })
      setMostrarForm(false); setPreco(''); carregarPrecos()
    } catch (err: any) { alert(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  async function handleExcluir(id: number) {
    await api.delete(`/combustivel/${id}`); carregarPrecos()
  }

  function fmtMoeda(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
  function fmtData(d: string) { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') }

  if (carregando) return <Loading />

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>Combustível</h1>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={{ background: colors.accent, padding: 10, borderRadius: 10, border: 'none', cursor: 'pointer', color: '#fff', fontSize: 20 }}>+</button>
      </div>

      {mostrarForm && (
        <Card style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Novo Preço</h2>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textSecondary, marginBottom: 6 }}>Combustível</label>
            <select value={tipoCombustivel} onChange={e => setTipoCombustivel(e.target.value)} style={{
              width: '100%', padding: '14px', background: colors.input, border: `1px solid ${colors.border}`,
              borderRadius: 12, color: colors.text, fontSize: 15, outline: 'none',
            }}>
              <option value="GASOLINA">Gasolina</option>
              <option value="ETANOL">Etanol</option>
              <option value="DIESEL">Diesel</option>
              <option value="GNV">GNV</option>
              <option value="ELETRICO">Elétrico</option>
            </select>
          </div>
          <Input label="Preço por litro (R$)" value={preco} onChange={e => setPreco(e.target.value)} placeholder="Ex: 5.899" type="number" />
          <Input label="Vigente desde" value={vigenteDesde} onChange={e => setVigenteDesde(e.target.value)} type="date" />
          <Button onClick={handleSubmit}>Salvar</Button>
        </Card>
      )}

      {precos.length === 0 ? (
        <EmptyState icon="⛽" title="Nenhum preço" description="Cadastre o preço do combustível" />
      ) : (
        precos.map(p => (
          <Card key={p.id} style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{p.tipoCombustivel}</p>
              <p style={{ fontSize: 13, color: colors.textMuted }}>Desde {fmtData(p.vigenteDesde)}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: colors.accent }}>{fmtMoeda(p.preco)}</p>
              <button onClick={() => handleExcluir(p.id)} style={{ background: 'none', border: 'none', color: colors.danger, cursor: 'pointer', fontSize: 16 }}>🗑</button>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
