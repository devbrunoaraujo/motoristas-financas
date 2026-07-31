import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as metaService from '../../services/metaService'
import type { MetaResponse } from '../../types/meta'
import { Card, Button, Input } from '../../components/ui'
import { Target, Save } from 'lucide-react'

export default function Metas() {
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
    } catch { setErro('Erro ao carregar metas') } finally { setCarregando(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setSucesso('')
    try {
      await metaService.criarOuAtualizarMeta({ metaMensal: Number(metaMensal) })
      setSucesso('Meta salva com sucesso!')
      carregarMeta()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  function fmtMoeda(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  // Calcular dias no mês para mostrar a meta diária estimada
  const hoje = new Date()
  const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate()
  const metaDiariaEstimada = metaMensal ? Number(metaMensal) / diasNoMes : 0

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 500, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-lg)' }}>
        <Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </Link>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Metas</h1>
      </div>

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{erro}</div>}
      {sucesso && <div style={{ padding: '10px 14px', background: 'rgba(0,184,148,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{sucesso}</div>}

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-lg)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(0,184,148,0.15), rgba(162,155,254,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={24} color="var(--accent)" />
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 600 }}>Meta Mensal de Lucro</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>O sistema calcula semanal e diária automaticamente</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Quanto você quer lucrar por mês?"
            type="number"
            step="0.01"
            min="0.01"
            value={metaMensal}
            onChange={e => setMetaMensal(e.target.value)}
            required
            placeholder="Ex: 4000.00"
          />

          <Button type="submit" fullWidth size="lg">
            <Save size={16} /> {meta ? 'Atualizar Meta' : 'Salvar Meta'}
          </Button>
        </form>
      </Card>

      {metaMensal && Number(metaMensal) > 0 && (
        <Card style={{ marginTop: 'var(--space-md)', animation: 'fadeIn 0.3s ease' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>Metas calculadas automaticamente</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div style={{ textAlign: 'center', padding: 14, background: 'rgba(116,185,255,0.08)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Diária</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--info)' }}>{fmtMoeda(metaDiariaEstimada)}</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{diasNoMes} dias</p>
            </div>
            <div style={{ textAlign: 'center', padding: 14, background: 'rgba(0,184,148,0.08)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Semanal</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{fmtMoeda(metaDiariaEstimada * 7)}</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>7 dias</p>
            </div>
            <div style={{ textAlign: 'center', padding: 14, background: 'rgba(162,155,254,0.08)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Mensal</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--purple)' }}>{fmtMoeda(Number(metaMensal))}</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{diasNoMes} dias</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
