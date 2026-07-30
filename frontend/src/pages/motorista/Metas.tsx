import { useState, useEffect } from 'react'
import * as metaService from '../../services/metaService'
import type { MetaRequest, MetaResponse } from '../../types/meta'
import { Card, Button, Input, PageHeader } from '../../components/ui'
import { Target, Save, TrendingUp, Calendar, BarChart3 } from 'lucide-react'

export default function Metas() {
  const [meta, setMeta] = useState<MetaResponse | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const [metaDiaria, setMetaDiaria] = useState('')
  const [metaSemanal, setMetaSemanal] = useState('')
  const [metaMensal, setMetaMensal] = useState('')

  useEffect(() => { carregarMeta() }, [])

  async function carregarMeta() {
    try {
      setCarregando(true)
      const data = await metaService.getMeta()
      setMeta(data)
      if (data) {
        setMetaDiaria(String(data.metaDiaria))
        setMetaSemanal(String(data.metaSemanal))
        setMetaMensal(String(data.metaMensal))
      }
    } catch { setErro('Erro ao carregar metas') } finally { setCarregando(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setSucesso('')
    const dados: MetaRequest = {
      metaDiaria: Number(metaDiaria),
      metaSemanal: Number(metaSemanal),
      metaMensal: Number(metaMensal),
    }
    try {
      await metaService.criarOuAtualizarMeta(dados)
      setSucesso('Metas salvas com sucesso!')
      carregarMeta()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  function fmtMoeda(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 500, margin: '0 auto' }}>
      <PageHeader title="Metas" />

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{erro}</div>}
      {sucesso && <div style={{ padding: '10px 14px', background: 'rgba(0,184,148,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{sucesso}</div>}

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-lg)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(0,184,148,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={22} color="var(--accent)" />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Definir Metas de Lucro</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Configure suas metas de lucro líquido</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-md)', padding: '12px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <Calendar size={18} color="var(--info)" />
            <div style={{ flex: 1 }}>
              <Input label="Meta Diária (R$)" type="number" step="0.01" min="0.01" value={metaDiaria} onChange={e => setMetaDiaria(e.target.value)} required placeholder="Ex: 150.00" style={{ marginBottom: 0 }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-md)', padding: '12px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <TrendingUp size={18} color="var(--accent)" />
            <div style={{ flex: 1 }}>
              <Input label="Meta Semanal (R$)" type="number" step="0.01" min="0.01" value={metaSemanal} onChange={e => setMetaSemanal(e.target.value)} required placeholder="Ex: 1000.00" style={{ marginBottom: 0 }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-lg)', padding: '12px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <BarChart3 size={18} color="var(--purple)" />
            <div style={{ flex: 1 }}>
              <Input label="Meta Mensal (R$)" type="number" step="0.01" min="0.01" value={metaMensal} onChange={e => setMetaMensal(e.target.value)} required placeholder="Ex: 4000.00" style={{ marginBottom: 0 }} />
            </div>
          </div>

          <Button type="submit" fullWidth size="lg">
            <Save size={16} /> {meta ? 'Atualizar Metas' : 'Salvar Metas'}
          </Button>
        </form>
      </Card>

      {meta && (
        <Card style={{ marginTop: 'var(--space-md)', animation: 'fadeIn 0.3s ease' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Metas atuais (desde {new Date(meta.vigenteDesde + 'T00:00:00').toLocaleDateString('pt-BR')})</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div style={{ textAlign: 'center', padding: 12, background: 'rgba(116,185,255,0.05)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Diária</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--info)' }}>{fmtMoeda(meta.metaDiaria)}</p>
            </div>
            <div style={{ textAlign: 'center', padding: 12, background: 'rgba(0,184,148,0.05)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Semanal</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{fmtMoeda(meta.metaSemanal)}</p>
            </div>
            <div style={{ textAlign: 'center', padding: 12, background: 'rgba(162,155,254,0.05)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Mensal</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--purple)' }}>{fmtMoeda(meta.metaMensal)}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
