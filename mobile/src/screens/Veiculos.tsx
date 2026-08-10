import { useState, useEffect } from 'react'
import { api } from '../api/api'
import { Card, Button, Input, Loading, EmptyState, colors } from '../components/ui'
import type { VeiculoResponse } from '../types'

export default function Veiculos() {
  const [veiculos, setVeiculos] = useState<VeiculoResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)

  const [apelido, setApelido] = useState('')
  const [placa, setPlaca] = useState('')
  const [tipoCombustivel, setTipoCombustivel] = useState('GASOLINA')
  const [autonomia, setAutonomia] = useState('')

  useEffect(() => { carregarVeiculos() }, [])

  async function carregarVeiculos() {
    try { const r = await api.get('/veiculos'); setVeiculos(r.data) } catch {} finally { setCarregando(false) }
  }

  async function handleSubmit() {
    try {
      await api.post('/veiculos', { apelido, placa: placa || undefined, tipoCombustivel, autonomia: Number(autonomia) })
      setMostrarForm(false); setApelido(''); setPlaca(''); setAutonomia(''); carregarVeiculos()
    } catch (err: any) { alert(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  async function handleInativar(id: number) {
    if (confirm('Inativar este veículo?')) {
      await api.delete(`/veiculos/${id}`); carregarVeiculos()
    }
  }

  if (carregando) return <Loading />

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>Veículos</h1>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={{ background: colors.accent, padding: 10, borderRadius: 10, border: 'none', cursor: 'pointer', color: '#fff', fontSize: 20 }}>+</button>
      </div>

      {mostrarForm && (
        <Card style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Novo Veículo</h2>
          <Input label="Apelido" value={apelido} onChange={e => setApelido(e.target.value)} placeholder="Ex: Onix 2022" />
          <Input label="Placa (opcional)" value={placa} onChange={e => setPlaca(e.target.value)} placeholder="ABC1D23" />
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
          <Input label="Autonomia (km/l)" value={autonomia} onChange={e => setAutonomia(e.target.value)} placeholder="Ex: 12.5" type="number" />
          <Button onClick={handleSubmit}>Cadastrar</Button>
        </Card>
      )}

      {veiculos.length === 0 ? (
        <EmptyState icon="🚗" title="Nenhum veículo" description="Cadastre seu primeiro veículo" />
      ) : (
        veiculos.map(v => (
          <Card key={v.id} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{v.apelido}</p>
                <p style={{ fontSize: 13, color: colors.textMuted }}>{v.placa || 'Sem placa'} • {v.tipoCombustivel} • {v.autonomia} km/l</p>
              </div>
              <button onClick={() => handleInativar(v.id)} style={{ background: 'none', border: 'none', color: colors.danger, cursor: 'pointer', fontSize: 18 }}>🗑</button>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
