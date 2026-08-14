import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as manutencaoService from '../services/manutencaoService'
import * as veiculoService from '../services/veiculoService'
import type { ManutencaoResponse, TipoManutencao, AlertaManutencaoResponse, DepreciacaoResponse, VeiculoResponse } from '../types'
import { Card, Button, Input, Loading, EmptyState, colors } from '../components/ui'
import { ArrowLeft, Wrench, Plus, Trash2, Save, X, AlertTriangle, TrendingDown } from 'lucide-react'

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
  const [alertas, setAlertas] = useState<AlertaManutencaoResponse[]>([])
  const [depreciacoes, setDepreciacoes] = useState<DepreciacaoResponse[]>([])
  const [veiculos, setVeiculos] = useState<VeiculoResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [mostrarAlertaForm, setMostrarAlertaForm] = useState(false)
  const [tab, setTab] = useState<'historico' | 'alertas' | 'depreciacao'>('historico')

  const [veiculoId, setVeiculoId] = useState<number>(0)
  const [tipo, setTipo] = useState<TipoManutencao>('TROCA_OLEO')
  const [descricao, setDescricao] = useState('')
  const [kmReferencia, setKmReferencia] = useState('')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [valor, setValor] = useState('')
  const [proximoKm, setProximoKm] = useState('')
  const [proximaData, setProximaData] = useState('')

  useEffect(() => { carregarDados() }, [])

  async function carregarDados() {
    try {
      setCarregando(true)
      const [v, m, a, d] = await Promise.all([
        veiculoService.listarVeiculos(),
        manutencaoService.listarHistoricoCompleto(),
        manutencaoService.listarAlertas(),
        manutencaoService.getDepreciacoes(),
      ])
      setVeiculos(v); setManutencoes(m); setAlertas(a); setDepreciacoes(d)
      if (v.length > 0 && veiculoId === 0) setVeiculoId(v[0].id)
    } catch { setErro('Erro ao carregar dados') } finally { setCarregando(false) }
  }

  function limparForm() {
    setTipo('TROCA_OLEO'); setDescricao(''); setKmReferencia(''); setData(new Date().toISOString().split('T')[0])
    setValor(''); setProximoKm(''); setProximaData(''); setMostrarForm(false); setMostrarAlertaForm(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setSucesso('')
    try {
      await manutencaoService.criarManutencao(veiculoId, {
        tipo, descricao: descricao || undefined, kmReferencia: Number(kmReferencia),
        data, valor: Number(valor), proximoKm: proximoKm ? Number(proximoKm) : undefined,
        proximaData: proximaData || undefined,
      })
      setSucesso('Manutenção registrada!'); limparForm(); carregarDados()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  async function handleAlerta(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setSucesso('')
    try {
      await manutencaoService.criarAlerta(veiculoId, {
        tipo, alertarAposData: proximaData,
      })
      setSucesso('Alerta criado!'); limparForm(); carregarDados()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao criar alerta') }
  }

  async function handleExcluir(veiculoId: number, id: number) {
    if (!confirm('Excluir este registro?')) return
    try { await manutencaoService.excluirManutencao(veiculoId, id); carregarDados() } catch { setErro('Erro ao excluir') }
  }

  async function handleDesativarAlerta(veiculoId: number, id: number) {
    try { await manutencaoService.desativarAlerta(veiculoId, id); carregarDados() } catch { setErro('Erro ao desativar') }
  }

  function fmtMoeda(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
  function fmtData(d?: string) { return d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '—' }

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
        <div style={{ display: 'flex', gap: 8 }}>
          {!mostrarForm && !mostrarAlertaForm && (
            <>
              <Button onClick={() => { setMostrarForm(true); setMostrarAlertaForm(false) }} style={{ width: 'auto', padding: '8px 16px' }}><Plus size={16} /> Registro</Button>
              <Button variant="ghost" onClick={() => { setMostrarAlertaForm(true); setMostrarForm(false) }} style={{ width: 'auto', padding: '8px 16px' }}><AlertTriangle size={16} /> Alerta</Button>
            </>
          )}
        </div>
      </div>

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 12, color: colors.danger, fontSize: 14, marginBottom: 16 }}>{erro}</div>}
      {sucesso && <div style={{ padding: '10px 14px', background: 'rgba(0,184,148,0.1)', borderRadius: 12, color: colors.accent, fontSize: 14, marginBottom: 16 }}>{sucesso}</div>}

      {/* Formulário de manutenção */}
      {mostrarForm && (
        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: colors.text }}>Registrar Manutenção</h3>
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
            <Input label="Data" type="date" value={data} onChange={e => setData(e.target.value)} />
            <Input label="Valor (R$)" type="number" value={valor} onChange={e => setValor(e.target.value)} placeholder="Ex: 250.00" />
            <Input label="Próximo KM (opcional)" type="number" value={proximoKm} onChange={e => setProximoKm(e.target.value)} placeholder="Ex: 50000" />
            <Input label="Próxima Data (opcional)" type="date" value={proximaData} onChange={e => setProximaData(e.target.value)} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ flex: 1, padding: '14px', background: colors.accent, border: 'none', borderRadius: 12, color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Save size={16} /> Salvar</button>
              <Button variant="ghost" onClick={limparForm}><X size={16} /></Button>
            </div>
          </form>
        </Card>
      )}

      {/* Formulário de alerta */}
      {mostrarAlertaForm && (
        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: colors.text }}>Criar Alerta por Data</h3>
          <form onSubmit={handleAlerta}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textSecondary, marginBottom: 6 }}>Veículo</label>
              <select value={veiculoId} onChange={e => setVeiculoId(Number(e.target.value))}
                style={{ width: '100%', padding: '14px', background: colors.input, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text, fontSize: 15, outline: 'none' }}>
                {veiculos.map(v => <option key={v.id} value={v.id}>{v.apelido}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textSecondary, marginBottom: 6 }}>Tipo de Manutenção</label>
              <select value={tipo} onChange={e => setTipo(e.target.value as TipoManutencao)}
                style={{ width: '100%', padding: '14px', background: colors.input, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text, fontSize: 15, outline: 'none' }}>
                {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <Input label="Alertar a partir de" type="date" value={proximaData} onChange={e => setProximaData(e.target.value)} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ flex: 1, padding: '14px', background: colors.accent, border: 'none', borderRadius: 12, color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Save size={16} /> Criar Alerta</button>
              <Button variant="ghost" onClick={limparForm}><X size={16} /></Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { key: 'historico', label: 'Histórico', icon: Wrench },
          { key: 'alertas', label: 'Alertas', icon: AlertTriangle },
          { key: 'depreciacao', label: 'Depreciação', icon: TrendingDown },
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

      {/* Histórico */}
      {tab === 'historico' && (
        manutencoes.length === 0 ? (
          <EmptyState icon="🔧" title="Nenhuma manutenção" description="Registre a primeira manutenção" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {manutencoes.map((m) => (
              <Card key={m.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{tipoLabel[m.tipo]}</p>
                    <p style={{ fontSize: 13, color: colors.textMuted }}>{m.veiculoApelido} • {m.kmReferencia} km • {fmtData(m.data)}</p>
                    {m.descricao && <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>{m.descricao}</p>}
                    {m.proximoKm && <p style={{ fontSize: 12, color: colors.info, marginTop: 4 }}>Próximo: {m.proximoKm} km</p>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: colors.danger }}>{fmtMoeda(m.valor)}</p>
                    <button onClick={() => handleExcluir(m.veiculoId, m.id)}
                      style={{ marginTop: 4, padding: 4, background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 8, color: colors.danger, cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Alertas */}
      {tab === 'alertas' && (
        alertas.length === 0 ? (
          <EmptyState icon="⚠️" title="Nenhum alerta" description="Crie alertas para manutenções futuras" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alertas.map((a) => (
              <Card key={a.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{tipoLabel[a.tipo]}</p>
                    <p style={{ fontSize: 13, color: colors.textMuted }}>{a.veiculoApelido}</p>
                    <p style={{ fontSize: 12, color: colors.info }}>A partir de {fmtData(a.alertarAposData)}</p>
                  </div>
                  <button onClick={() => handleDesativarAlerta(a.veiculoId, a.id)}
                    style={{ padding: 6, background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 8, color: colors.danger, cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Depreciação */}
      {tab === 'depreciacao' && (
        depreciacoes.length === 0 ? (
          <EmptyState icon="📉" title="Nenhum veículo" description="Cadastre veículos com valor de compra" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {depreciacoes.map((d) => (
              <Card key={d.veiculoId}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: colors.text }}>{d.veiculoApelido}</h3>
                {d.valorCompra ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 8 }}>
                      <div style={{ padding: 8, background: colors.input, borderRadius: 8 }}>
                        <p style={{ fontSize: 11, color: colors.textMuted }}>Valor Compra</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{fmtMoeda(d.valorCompra)}</p>
                      </div>
                      <div style={{ padding: 8, background: colors.input, borderRadius: 8 }}>
                        <p style={{ fontSize: 11, color: colors.textMuted }}>Valor Atual Est.</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: colors.accent }}>{d.valorAtualEstimado ? fmtMoeda(d.valorAtualEstimado) : '—'}</p>
                      </div>
                      <div style={{ padding: 8, background: colors.input, borderRadius: 8 }}>
                        <p style={{ fontSize: 11, color: colors.textMuted }}>Depreciação Total</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: colors.danger }}>{fmtMoeda(d.depreciacaoTotal)}</p>
                      </div>
                      <div style={{ padding: 8, background: colors.input, borderRadius: 8 }}>
                        <p style={{ fontSize: 11, color: colors.textMuted }}>Depreciação/Dia</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{fmtMoeda(d.depreciacaoDiaria)}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: colors.textMuted }}>{d.diasDesdeAquisicao} dias desde aquisição</p>
                  </>
                ) : (
                  <p style={{ fontSize: 13, color: colors.textMuted }}>Cadastre o valor de compra e data de aquisição do veículo para calcular a depreciação.</p>
                )}
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  )
}
