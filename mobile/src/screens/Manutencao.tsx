import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as manutencaoService from '../services/manutencaoService'
import * as veiculoService from '../services/veiculoService'
import * as despesaService from '../services/despesaService'
import type { ManutencaoResponse, TipoManutencao, VeiculoResponse } from '../types'
import { Card, Button, Input, Loading, EmptyState, colors } from '../components/ui'
import { ArrowLeft, Plus, Trash2, Save, X, AlertTriangle, Check, Clock } from 'lucide-react'

const TIPOS: { value: TipoManutencao; label: string }[] = [
  { value: 'TROCA_OLEO', label: 'Troca de Óleo' },
  { value: 'PNEUS', label: 'Pneus' },
  { value: 'REVISAO', label: 'Revisão' },
  { value: 'FREIOS', label: 'Freios' },
  { value: 'FILTROS', label: 'Filtros' },
  { value: 'ALINHAMENTO', label: 'Alinhamento' },
  { value: 'BATERIA', label: 'Bateria' },
  { value: 'OUTROS', label: 'Outros' },
]

const tipoLabel: Record<TipoManutencao, string> = {
  TROCA_OLEO: 'Troca de Óleo', PNEUS: 'Pneus', REVISAO: 'Revisão',
  FREIOS: 'Freios', FILTROS: 'Filtros', ALINHAMENTO: 'Alinhamento',
  BATERIA: 'Bateria', OUTROS: 'Outros',
}

export default function Manutencao() {
  const navigate = useNavigate()
  const [manutencoes, setManutencoes] = useState<ManutencaoResponse[]>([])
  const [veiculos, setVeiculos] = useState<VeiculoResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [tab, setTab] = useState<'pendentes' | 'historico'>('pendentes')
  const [confirmandoDespesa, setConfirmandoDespesa] = useState<ManutencaoResponse | null>(null)

  const [veiculoId, setVeiculoId] = useState<number>(0)
  const [tipo, setTipo] = useState<TipoManutencao>('TROCA_OLEO')
  const [descricao, setDescricao] = useState('')
  const [kmReferencia, setKmReferencia] = useState('')
  const [valor, setValor] = useState('')
  const [proximaData, setProximaData] = useState('')

  useEffect(() => { carregarDados() }, [])

  async function carregarDados() {
    try {
      setCarregando(true)
      const [v, m] = await Promise.all([
        veiculoService.listarVeiculos(),
        manutencaoService.listarHistoricoCompleto(),
      ])
      setVeiculos(v); setManutencoes(m)
      if (v.length > 0 && veiculoId === 0) setVeiculoId(v[0].id)
    } catch { setErro('Erro ao carregar dados') } finally { setCarregando(false) }
  }

  function limparForm() {
    setTipo('TROCA_OLEO'); setDescricao(''); setKmReferencia('')
    setValor(''); setProximaData(''); setMostrarForm(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setSucesso('')
    try {
      await manutencaoService.criarManutencao(veiculoId, {
        tipo, descricao: descricao || undefined, kmReferencia: Number(kmReferencia),
        data: new Date().toISOString().split('T')[0],
        valor: Number(valor),
        proximaData: proximaData || undefined,
      })
      setSucesso('Manutenção preventiva registrada!'); limparForm(); carregarDados()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  async function handleConcluir(manutencao: ManutencaoResponse) {
    setConfirmandoDespesa(manutencao)
  }

  async function handleConfirmarDespesa(adicionarDespesa: boolean) {
    if (!confirmandoDespesa) return
    try {
      if (adicionarDespesa) {
        // Create expense with maintenance value
        await despesaService.criarDespesa({
          categoria: 'MANUTENCAO',
          descricao: `${tipoLabel[confirmandoDespesa.tipo]} - ${confirmandoDespesa.veiculoApelido}`,
          valor: confirmandoDespesa.valor,
          data: new Date().toISOString().split('T')[0]
        })
      }
      
      // Mark maintenance as done (delete from pending)
      await manutencaoService.excluirManutencao(confirmandoDespesa.veiculoId, confirmandoDespesa.id)
      
      setSucesso(adicionarDespesa 
        ? 'Manutenção concluída! Valor adicionado às despesas.' 
        : 'Manutenção concluída!')
      
      setConfirmandoDespesa(null)
      carregarDados()
    } catch { setErro('Erro ao concluir manutenção') }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Excluir este registro?')) return
    try { await manutencaoService.excluirManutencao(0, id); carregarDados() } catch { setErro('Erro ao excluir') }
  }

  function fmtMoeda(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
  function fmtData(d?: string) { return d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '—' }

  function isVencida(data?: string): boolean {
    if (!data) return false
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const dataManutencao = new Date(data + 'T00:00:00')
    return dataManutencao <= hoje
  }

  // Separate pending (future) and completed (past) maintenances
  const manutencoesPendentes = manutencoes.filter(m => m.proximaData && isVencida(m.proximaData))
  const manutencoesFuturas = manutencoes.filter(m => m.proximaData && !isVencida(m.proximaData))
  const historico = manutencoes.filter(m => !m.proximaData)

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
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text, flex: 1 }}>Manutenção</h1>
        {!mostrarForm && (
          <Button onClick={() => setMostrarForm(true)} style={{ width: 'auto', padding: '8px 16px' }}><Plus size={16} /> Nova</Button>
        )}
      </div>

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 12, color: colors.danger, fontSize: 14, marginBottom: 16 }}>{erro}</div>}
      {sucesso && <div style={{ padding: '10px 14px', background: 'rgba(0,184,148,0.1)', borderRadius: 12, color: colors.accent, fontSize: 14, marginBottom: 16 }}>{sucesso}</div>}

      {/* Form */}
      {mostrarForm && (
        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: colors.text }}>Registrar Manutenção Preventiva</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textSecondary, marginBottom: 6 }}>Veículo</label>
              <select value={veiculoId} onChange={e => setVeiculoId(Number(e.target.value))}
                style={{ width: '100%', padding: '14px', background: colors.input, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text, fontSize: 15, outline: 'none' }}>
                {veiculos.map(v => <option key={v.id} value={v.id}>{v.apelido}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textSecondary, marginBottom: 6 }}>Tipo</label>
              <select value={tipo} onChange={e => setTipo(e.target.value as TipoManutencao)}
                style={{ width: '100%', padding: '14px', background: colors.input, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text, fontSize: 15, outline: 'none' }}>
                {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <Input label="Descrição (opcional)" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Óleo 5W30" />
            <Input label="KM Referência" type="number" value={kmReferencia} onChange={e => setKmReferencia(e.target.value)} placeholder="Ex: 45000" />
            <Input label="Valor Estimado (R$)" type="number" value={valor} onChange={e => setValor(e.target.value)} placeholder="Ex: 250.00" />
            <Input label="Data da Manutenção" type="date" value={proximaData} onChange={e => setProximaData(e.target.value)} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ flex: 1, padding: '14px', background: colors.accent, border: 'none', borderRadius: 12, color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Save size={16} /> Salvar</button>
              <Button variant="ghost" onClick={limparForm}><X size={16} /></Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { key: 'pendentes', label: 'Pendentes', icon: AlertTriangle },
          { key: 'historico', label: 'Histórico', icon: Clock },
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

      {/* Pending Maintenances */}
      {tab === 'pendentes' && (
        <>
          {/* Overdue alerts */}
          {manutencoesPendentes.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.danger, marginBottom: 8 }}>Vencidas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {manutencoesPendentes.map((m) => (
                  <Card key={m.id} style={{ border: `1px solid ${colors.danger}40` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{tipoLabel[m.tipo]}</p>
                        <p style={{ fontSize: 13, color: colors.textMuted }}>{m.veiculoApelido}</p>
                        {m.descricao && <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>{m.descricao}</p>}
                        <p style={{ fontSize: 12, color: colors.danger, marginTop: 4 }}>Venceu em {fmtData(m.proximaData)}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 16, fontWeight: 700, color: colors.danger }}>{fmtMoeda(m.valor)}</p>
                        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                          <button onClick={() => handleConcluir(m)}
                            style={{ padding: '6px 12px', background: colors.accent, border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Check size={14} /> Concluir
                          </button>
                          <button onClick={() => handleExcluir(m.id)}
                            style={{ padding: 6, background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 8, color: colors.danger, cursor: 'pointer' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Future maintenances */}
          {manutencoesFuturas.length > 0 && (
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.info, marginBottom: 8 }}>Agendadas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {manutencoesFuturas.map((m) => (
                  <Card key={m.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{tipoLabel[m.tipo]}</p>
                        <p style={{ fontSize: 13, color: colors.textMuted }}>{m.veiculoApelido}</p>
                        {m.descricao && <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>{m.descricao}</p>}
                        <p style={{ fontSize: 12, color: colors.info, marginTop: 4 }}>Agendada para {fmtData(m.proximaData)}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>{fmtMoeda(m.valor)}</p>
                        <button onClick={() => handleExcluir(m.id)}
                          style={{ marginTop: 8, padding: 6, background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 8, color: colors.danger, cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {manutencoesPendentes.length === 0 && manutencoesFuturas.length === 0 && (
            <EmptyState icon="✅" title="Nenhuma manutenção pendente" description="Registre manutenções preventivas" />
          )}
        </>
      )}

      {/* History */}
      {tab === 'historico' && (
        historico.length === 0 ? (
          <EmptyState icon="🔧" title="Nenhum histórico" description="Manutenções concluídas aparecerão aqui" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {historico.map((m) => (
              <Card key={m.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{tipoLabel[m.tipo]}</p>
                    <p style={{ fontSize: 13, color: colors.textMuted }}>{m.veiculoApelido} • {m.kmReferencia} km • {fmtData(m.data)}</p>
                    {m.descricao && <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>{m.descricao}</p>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: colors.danger }}>{fmtMoeda(m.valor)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Confirm expense modal */}
      {confirmandoDespesa && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: 16,
        }}>
          <Card style={{ maxWidth: 400, width: '100%' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Manutenção Concluída!</h3>
            <p style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
              Deseja adicionar o valor de {fmtMoeda(confirmandoDespesa.valor)} às despesas do mês?
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={() => handleConfirmarDespesa(true)} style={{ flex: 1 }}>
                <Check size={16} /> Sim, adicionar
              </Button>
              <Button variant="ghost" onClick={() => handleConfirmarDespesa(false)} style={{ flex: 1 }}>
                Não
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
