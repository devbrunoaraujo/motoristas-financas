import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as financeiroService from '../services/financeiroService'
import type { CustoFixoResponse, PontoEquilibrioResponse } from '../types'
import { Card, Button, Input, Loading, EmptyState, colors } from '../components/ui'
import { ArrowLeft, DollarSign, Plus, Trash2, Save, X, TrendingUp, TrendingDown, Target, PiggyBank } from 'lucide-react'

export default function Financeiro() {
  const navigate = useNavigate()
  const [custos, setCustos] = useState<CustoFixoResponse[]>([])
  const [pontoEquilibrio, setPontoEquilibrio] = useState<PontoEquilibrioResponse | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [tab, setTab] = useState<'custos' | 'pontoEquilibrio'>('custos')

  const [descricao, setDescricao] = useState('')
  const [valorMensal, setValorMensal] = useState('')

  useEffect(() => { carregarDados() }, [])

  async function carregarDados() {
    try {
      setCarregando(true)
      const [c, p] = await Promise.all([
        financeiroService.listarCustosFixos(),
        financeiroService.getPontoEquilibrio()
      ])
      setCustos(c); setPontoEquilibrio(p)
    } catch { setErro('Erro ao carregar dados') } finally { setCarregando(false) }
  }

  function limparForm() {
    setDescricao(''); setValorMensal(''); setMostrarForm(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setSucesso('')
    try {
      await financeiroService.criarCustoFixo({ descricao, valorMensal: Number(valorMensal) })
      setSucesso('Custo cadastrado!'); limparForm(); carregarDados()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Excluir este custo?')) return
    try { await financeiroService.excluirCustoFixo(id); carregarDados() } catch { setErro('Erro ao excluir') }
  }

  function fmtMoeda(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }

  const totalCustos = custos.reduce((acc, c) => acc + c.valorMensal, 0)

  if (carregando) return <Loading />

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>Financeiro</h1>
      </div>

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 12, color: colors.danger, fontSize: 14, marginBottom: 16 }}>{erro}</div>}
      {sucesso && <div style={{ padding: '10px 14px', background: 'rgba(0,184,148,0.1)', borderRadius: 12, color: colors.accent, fontSize: 14, marginBottom: 16 }}>{sucesso}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { key: 'custos', label: 'Custos Fixos', icon: DollarSign },
          { key: 'pontoEquilibrio', label: 'Ponto de Equilíbrio', icon: Target },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{
              flex: 1, padding: '10px', borderRadius: 12,
              background: tab === t.key ? colors.accent : colors.input,
              color: tab === t.key ? '#fff' : colors.textSecondary,
              border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Custos Fixos */}
      {tab === 'custos' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: colors.textSecondary }}>Total: <strong>{fmtMoeda(totalCustos)}</strong>/mês</p>
            {!mostrarForm && (
              <Button onClick={() => setMostrarForm(true)} style={{ width: 'auto', padding: '8px 16px' }}><Plus size={16} /> Novo</Button>
            )}
          </div>

          {mostrarForm && (
            <Card style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: colors.text }}>Novo Custo Fixo</h3>
              <form onSubmit={handleSubmit}>
                <Input label="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Aluguel, Seguro, IPVA" />
                <Input label="Valor Mensal (R$)" type="number" value={valorMensal} onChange={e => setValorMensal(e.target.value)} placeholder="Ex: 500.00" />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" style={{ flex: 1, padding: '14px', background: colors.accent, border: 'none', borderRadius: 12, color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Save size={16} /> Salvar</button>
                  <Button variant="ghost" onClick={limparForm}><X size={16} /></Button>
                </div>
              </form>
            </Card>
          )}

          {custos.length === 0 ? (
            <EmptyState icon="💰" title="Nenhum custo fixo" description="Cadastre seus custos mensais fixos" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {custos.map((c) => (
                <Card key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{c.descricao}</p>
                    <p style={{ fontSize: 13, color: colors.textMuted }}>Mensal</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: colors.danger }}>{fmtMoeda(c.valorMensal)}</p>
                    <button onClick={() => handleExcluir(c.id)} style={{ padding: 6, background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 8, color: colors.danger, cursor: 'pointer' }}><Trash2 size={14} /></button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Ponto de Equilíbrio */}
      {tab === 'pontoEquilibrio' && pontoEquilibrio && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card style={{
            background: pontoEquilibrio.acimaDoPontoEquilibrio
              ? 'linear-gradient(135deg, rgba(0,184,148,0.1), rgba(0,184,148,0.05))'
              : 'linear-gradient(135deg, rgba(225,112,85,0.1), rgba(225,112,85,0.05))',
            border: `1px solid ${pontoEquilibrio.acimaDoPontoEquilibrio ? 'rgba(0,184,148,0.2)' : 'rgba(225,112,85,0.2)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              {pontoEquilibrio.acimaDoPontoEquilibrio ? <TrendingUp size={24} color={colors.accent} /> : <TrendingDown size={24} color={colors.danger} />}
              <div>
                <p style={{ fontSize: 18, fontWeight: 700, color: pontoEquilibrio.acimaDoPontoEquilibrio ? colors.accent : colors.danger }}>
                  {pontoEquilibrio.acimaDoPontoEquilibrio ? 'Acima do Ponto de Equilíbrio' : 'Abaixo do Ponto de Equilíbrio'}
                </p>
                <p style={{ fontSize: 14, color: colors.textSecondary }}>
                  Margem: {fmtMoeda(pontoEquilibrio.margemAtual)}/dia
                </p>
              </div>
            </div>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <Card>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Custos Fixos/Mês</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: colors.danger }}>{fmtMoeda(pontoEquilibrio.custosFixosMensal)}</p>
            </Card>
            <Card>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Custo Variável/Dia</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: colors.warning }}>{fmtMoeda(pontoEquilibrio.custoVariavelMedioDia)}</p>
            </Card>
            <Card>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Ganho Médio/Dia</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: colors.accent }}>{fmtMoeda(pontoEquilibrio.ganhoMedioDia)}</p>
            </Card>
            <Card>
              <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Ponto Equilíbrio/Dia</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: colors.info }}>{fmtMoeda(pontoEquilibrio.pontoEquilibrioDia)}</p>
            </Card>
          </div>

          <Card>
            <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Ponto de Equilíbrio Mensal</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#a29bfe' }}>{fmtMoeda(pontoEquilibrio.pontoEquilibrioMes)}</p>
            <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>
              Você precisa faturar pelo menos {fmtMoeda(pontoEquilibrio.pontoEquilibrioMes)} por mês para cobrir todos os custos.
            </p>
          </Card>

          {custos.length === 0 && (
            <Card style={{ background: 'rgba(253,203,110,0.1)', border: '1px solid rgba(253,203,110,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PiggyBank size={18} color={colors.warning} />
                <p style={{ fontSize: 13, color: colors.warning }}>
                  Cadastre seus custos fixos (aluguel, seguro, IPVA, etc.) para um cálculo mais preciso do ponto de equilíbrio.
                </p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
