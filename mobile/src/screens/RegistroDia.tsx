import { useState, useEffect } from 'react'
import { api } from '../api/api'
import { Card, Button, Input, Loading, EmptyState, colors } from '../components/ui'
import type { RegistroDiaResponse, VeiculoResponse, Plataforma } from '../types'

export default function RegistroDia() {
  const [registros, setRegistros] = useState<RegistroDiaResponse[]>([])
  const [veiculos, setVeiculos] = useState<VeiculoResponse[]>([])
  const [plataformas, setPlataformas] = useState<Plataforma[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [erro, setErro] = useState('')

  const [veiculoId, setVeiculoId] = useState(0)
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [kmRodado, setKmRodado] = useState('')
  const [ganhos, setGanhos] = useState<{ plataformaId: number; valor: string }[]>([{ plataformaId: 0, valor: '' }])

  useEffect(() => { carregarDados() }, [])

  async function carregarDados() {
    try {
      const [r, v, p] = await Promise.all([api.get('/registros'), api.get('/veiculos'), api.get('/plataformas')])
      setRegistros(r.data); setVeiculos(v.data); setPlataformas(p.data)
      if (v.data.length > 0 && veiculoId === 0) setVeiculoId(v.data[0].id)
      if (p.data.length > 0) setGanhos([{ plataformaId: p.data[0].id, valor: '' }])
    } catch {} finally { setCarregando(false) }
  }

  async function handleSubmit() {
    setErro('')
    try {
      await api.post('/registros', {
        veiculoId, data, kmRodado: Number(kmRodado),
        ganhos: ganhos.filter(g => Number(g.valor) > 0).map(g => ({ plataformaId: g.plataformaId, valor: Number(g.valor) })),
      })
      setMostrarForm(false); carregarDados()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  async function handleExcluir(id: number) {
    if (confirm('Excluir este registro?')) {
      await api.delete(`/registros/${id}`); carregarDados()
    }
  }

  function fmtMoeda(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
  function fmtData(d: string) { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') }

  if (carregando) return <Loading />

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>Registros</h1>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={{ background: colors.accent, padding: 10, borderRadius: 10, border: 'none', cursor: 'pointer', color: '#fff', fontSize: 20 }}>+</button>
      </div>

      {erro && <p style={{ color: colors.danger, marginBottom: 12 }}>{erro}</p>}

      {mostrarForm && (
        <Card style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Novo Registro</h2>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textSecondary, marginBottom: 6 }}>Veículo</label>
            <select value={veiculoId} onChange={e => setVeiculoId(Number(e.target.value))} style={{
              width: '100%', padding: '14px', background: colors.input, border: `1px solid ${colors.border}`,
              borderRadius: 12, color: colors.text, fontSize: 15, outline: 'none',
            }}>
              {veiculos.map(v => <option key={v.id} value={v.id}>{v.apelido}</option>)}
            </select>
          </div>
          <Input label="Data" value={data} onChange={e => setData(e.target.value)} type="date" />
          <Input label="KM Rodado" value={kmRodado} onChange={e => setKmRodado(e.target.value)} placeholder="Ex: 150" type="number" />
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textSecondary, marginBottom: 6 }}>Ganhos por Plataforma</label>
            {ganhos.map((g, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <select value={g.plataformaId} onChange={e => {
                  const ng = [...ganhos]; ng[i] = { ...ng[i], plataformaId: Number(e.target.value) }; setGanhos(ng)
                }} style={{
                  flex: 1, padding: '10px', background: colors.input, border: `1px solid ${colors.border}`,
                  borderRadius: 12, color: colors.text, fontSize: 14, outline: 'none',
                }}>
                  {plataformas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
                <input type="number" step="0.01" placeholder="Valor" value={g.valor}
                  onChange={e => { const ng = [...ganhos]; ng[i] = { ...ng[i], valor: e.target.value }; setGanhos(ng) }}
                  style={{ flex: 1, padding: '10px', background: colors.input, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text, fontSize: 14, outline: 'none' }} />
                {ganhos.length > 1 && (
                  <button onClick={() => setGanhos(ganhos.filter((_, j) => j !== i))}
                    style={{ padding: '10px', background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 12, color: colors.danger, cursor: 'pointer' }}>X</button>
                )}
              </div>
            ))}
            <button onClick={() => setGanhos([...ganhos, { plataformaId: plataformas[0]?.id || 0, valor: '' }])}
              style={{ padding: '8px 12px', background: 'none', border: `1px dashed ${colors.border}`, borderRadius: 12, color: colors.textMuted, cursor: 'pointer', fontSize: 13 }}>
              + Adicionar plataforma
            </button>
          </div>
          <Button onClick={handleSubmit}>Salvar</Button>
        </Card>
      )}

      {registros.length === 0 ? (
        <EmptyState icon="📅" title="Nenhum registro" description="Registre seu primeiro dia" />
      ) : (
        registros.map(reg => (
          <Card key={reg.id} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{fmtData(reg.data)}</p>
                <p style={{ fontSize: 13, color: colors.textMuted }}>{reg.veiculoApelido} • {reg.kmRodado} km</p>
              </div>
              <button onClick={() => handleExcluir(reg.id)} style={{ background: 'none', border: 'none', color: colors.danger, cursor: 'pointer', fontSize: 18 }}>🗑</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center' }}><p style={{ fontSize: 11, color: colors.textMuted }}>Ganho</p><p style={{ fontSize: 15, fontWeight: 600, color: colors.accent }}>{fmtMoeda(reg.ganhoBrutoTotal)}</p></div>
              <div style={{ textAlign: 'center' }}><p style={{ fontSize: 11, color: colors.textMuted }}>Combustível</p><p style={{ fontSize: 15, fontWeight: 600, color: colors.danger }}>{fmtMoeda(reg.gastoCombustivelCalculado)}</p></div>
              <div style={{ textAlign: 'center' }}><p style={{ fontSize: 11, color: colors.textMuted }}>Lucro</p><p style={{ fontSize: 15, fontWeight: 700, color: reg.lucroLiquido >= 0 ? colors.accent : colors.danger }}>{fmtMoeda(reg.lucroLiquido)}</p></div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
