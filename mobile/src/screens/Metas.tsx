import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as metaService from '../services/metaService'
import type { MetaResponse } from '../types'
import { Card, Button, Input, Loading, colors } from '../components/ui'
import { Target, Save, ArrowLeft } from 'lucide-react'

export default function Metas() {
  const navigate = useNavigate()
  const [meta, setMeta] = useState<MetaResponse | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [metaMensal, setMetaMensal] = useState('')

  useEffect(() => { carregarMeta() }, [])

  async function carregarMeta() {
    try {
      setCarregando(true)
      const data = await metaService.getMeta()
      setMeta(data)
      if (data) setMetaMensal(String(data.metaMensal))
    } catch {
      setErro('Erro ao carregar metas')
    } finally {
      setCarregando(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    try {
      await metaService.criarOuAtualizarMeta({ metaMensal: Number(metaMensal) })
      setSucesso('Meta salva com sucesso!')
      carregarMeta()
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || 'Erro ao salvar')
    }
  }

  function fmtMoeda(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  if (carregando) return <Loading />

  const hoje = new Date()
  const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate()
  const metaDiariaEstimada = metaMensal ? Number(metaMensal) / diasNoMes : 0

  return (
    <div style={{ padding: 16, maxWidth: 500, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>Metas</h1>
      </div>

      {erro && (
        <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 12, color: colors.danger, fontSize: 14, marginBottom: 16 }}>
          {erro}
        </div>
      )}
      {sucesso && (
        <div style={{ padding: '10px 14px', background: 'rgba(0,184,148,0.1)', borderRadius: 12, color: colors.accent, fontSize: 14, marginBottom: 16 }}>
          {sucesso}
        </div>
      )}

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, rgba(0,184,148,0.15), rgba(162,155,254,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={24} color={colors.accent} />
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: colors.text }}>Meta Mensal de Lucro</h2>
            <p style={{ fontSize: 13, color: colors.textMuted }}>O sistema calcula semanal e diária automaticamente</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Quanto você quer lucrar por mês?"
            type="number"
            value={metaMensal}
            onChange={e => setMetaMensal(e.target.value)}
            placeholder="Ex: 4000.00"
          />

          <Button onClick={() => {}} fullWidth>
            <Save size={16} /> {meta ? 'Atualizar Meta' : 'Salvar Meta'}
          </Button>
        </form>
      </Card>

      {metaMensal && Number(metaMensal) > 0 && (
        <Card style={{ marginTop: 16, animation: 'fadeIn 0.3s ease' }}>
          <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16 }}>Metas calculadas automaticamente</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div style={{ textAlign: 'center', padding: 14, background: 'rgba(116,185,255,0.08)', borderRadius: 12 }}>
              <p style={{ fontSize: 11, color: colors.textMuted, marginBottom: 6 }}>Diária</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: colors.info }}>{fmtMoeda(metaDiariaEstimada)}</p>
              <p style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>{diasNoMes} dias</p>
            </div>
            <div style={{ textAlign: 'center', padding: 14, background: 'rgba(0,184,148,0.08)', borderRadius: 12 }}>
              <p style={{ fontSize: 11, color: colors.textMuted, marginBottom: 6 }}>Semanal</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: colors.accent }}>{fmtMoeda(metaDiariaEstimada * 7)}</p>
              <p style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>7 dias</p>
            </div>
            <div style={{ textAlign: 'center', padding: 14, background: 'rgba(162,155,254,0.08)', borderRadius: 12 }}>
              <p style={{ fontSize: 11, color: colors.textMuted, marginBottom: 6 }}>Mensal</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#a29bfe' }}>{fmtMoeda(Number(metaMensal))}</p>
              <p style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>{diasNoMes} dias</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
