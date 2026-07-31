import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as financeiroService from '../../services/financeiroService'
import type { CustoFixoResponse, PontoEquilibrioResponse } from '../../types/financeiro'
import { Card, Button, Input, EmptyState } from '../../components/ui'
import { DollarSign, Plus, Trash2, Save, X, TrendingUp, TrendingDown, Target, PiggyBank } from 'lucide-react'

export default function Financeiro() {
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

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-lg)' }}>
        <Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </Link>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Financeiro</h1>
      </div>

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{erro}</div>}
      {sucesso && <div style={{ padding: '10px 14px', background: 'rgba(0,184,148,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{sucesso}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-md)' }}>
        {[
          { key: 'custos', label: 'Custos Fixos', icon: DollarSign },
          { key: 'pontoEquilibrio', label: 'Ponto de Equilíbrio', icon: Target },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{
              flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
              background: tab === t.key ? 'var(--accent)' : 'var(--bg-input)',
              color: tab === t.key ? '#fff' : 'var(--text-secondary)',
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Total: <strong>{fmtMoeda(totalCustos)}</strong>/mês</p>
            {!mostrarForm && (
              <Button size="sm" onClick={() => setMostrarForm(true)}><Plus size={16} /> Novo</Button>
            )}
          </div>

          {mostrarForm && (
            <Card style={{ marginBottom: 'var(--space-md)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 'var(--space-md)' }}>Novo Custo Fixo</h3>
              <form onSubmit={handleSubmit}>
                <Input label="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} required placeholder="Ex: Aluguel, Seguro, IPVA" />
                <Input label="Valor Mensal (R$)" type="number" step="0.01" min="0.01" value={valorMensal} onChange={e => setValorMensal(e.target.value)} required placeholder="Ex: 500.00" />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button type="submit" fullWidth><Save size={16} /> Salvar</Button>
                  <Button variant="ghost" onClick={limparForm}><X size={16} /></Button>
                </div>
              </form>
            </Card>
          )}

          {custos.length === 0 ? (
            <EmptyState icon={<DollarSign size={48} />} title="Nenhum custo fixo" description="Cadastre seus custos mensais fixos" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {custos.map((c, i) => (
                <Card key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', animationDelay: `${i * 50}ms` }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600 }}>{c.descricao}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Mensal</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--danger)' }}>{fmtMoeda(c.valorMensal)}</p>
                    <button onClick={() => handleExcluir(c.id)} style={{ padding: 6, background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={14} /></button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Ponto de Equilíbrio */}
      {tab === 'pontoEquilibrio' && pontoEquilibrio && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <Card style={{
            background: pontoEquilibrio.acimaDoPontoEquilibrio
              ? 'linear-gradient(135deg, rgba(0,184,148,0.1), rgba(0,184,148,0.05))'
              : 'linear-gradient(135deg, rgba(225,112,85,0.1), rgba(225,112,85,0.05))',
            border: `1px solid ${pontoEquilibrio.acimaDoPontoEquilibrio ? 'rgba(0,184,148,0.2)' : 'rgba(225,112,85,0.2)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              {pontoEquilibrio.acimaDoPontoEquilibrio ? <TrendingUp size={24} color="var(--accent)" /> : <TrendingDown size={24} color="var(--danger)" />}
              <div>
                <p style={{ fontSize: 18, fontWeight: 700, color: pontoEquilibrio.acimaDoPontoEquilibrio ? 'var(--accent)' : 'var(--danger)' }}>
                  {pontoEquilibrio.acimaDoPontoEquilibrio ? 'Acima do Ponto de Equilíbrio' : 'Abaixo do Ponto de Equilíbrio'}
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  Margem: {fmtMoeda(pontoEquilibrio.margemAtual)}/dia
                </p>
              </div>
            </div>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)' }}>
            <Card>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Custos Fixos/Mês</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--danger)' }}>{fmtMoeda(pontoEquilibrio.custosFixosMensal)}</p>
            </Card>
            <Card>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Custo Variável/Dia</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--warning)' }}>{fmtMoeda(pontoEquilibrio.custoVariavelMedioDia)}</p>
            </Card>
            <Card>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Ganho Médio/Dia</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>{fmtMoeda(pontoEquilibrio.ganhoMedioDia)}</p>
            </Card>
            <Card>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Ponto Equilíbrio/Dia</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--info)' }}>{fmtMoeda(pontoEquilibrio.pontoEquilibrioDia)}</p>
            </Card>
          </div>

          <Card>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Ponto de Equilíbrio Mensal</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--purple)' }}>{fmtMoeda(pontoEquilibrio.pontoEquilibrioMes)}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Você precisa faturar pelo menos {fmtMoeda(pontoEquilibrio.pontoEquilibrioMes)} por mês para cobrir todos os custos.
            </p>
          </Card>

          {custos.length === 0 && (
            <Card style={{ background: 'rgba(253,203,110,0.1)', border: '1px solid rgba(253,203,110,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PiggyBank size={18} color="var(--warning)" />
                <p style={{ fontSize: 13, color: 'var(--warning)' }}>
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
