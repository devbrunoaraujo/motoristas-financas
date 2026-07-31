import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as manutencaoService from '../../services/manutencaoService'
import * as veiculoService from '../../services/veiculoService'
import type { ManutencaoResponse, TipoManutencao, AlertaManutencaoResponse, DepreciacaoResponse } from '../../types/manutencao'
import type { VeiculoResponse } from '../../types/veiculo'
import { Card, Button, Input, Select, EmptyState } from '../../components/ui'
import { Wrench, Plus, Trash2, Save, X, AlertTriangle, TrendingDown } from 'lucide-react'

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

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-lg)' }}>
        <Link to="/registros" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, flex: 1 }}>Manutenção</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {!mostrarForm && !mostrarAlertaForm && (
            <>
              <Button size="sm" onClick={() => { setMostrarForm(true); setMostrarAlertaForm(false) }}><Plus size={16} /> Registro</Button>
              <Button size="sm" variant="ghost" onClick={() => { setMostrarAlertaForm(true); setMostrarForm(false) }}><AlertTriangle size={16} /> Alerta</Button>
            </>
          )}
        </div>
      </div>

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{erro}</div>}
      {sucesso && <div style={{ padding: '10px 14px', background: 'rgba(0,184,148,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{sucesso}</div>}

      {/* Formulário de manutenção */}
      {mostrarForm && (
        <Card style={{ marginBottom: 'var(--space-md)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 'var(--space-md)' }}>Registrar Manutenção</h3>
          <form onSubmit={handleSubmit}>
            <Select label="Veículo" value={veiculoId} onChange={e => setVeiculoId(Number(e.target.value))}
              options={veiculos.map(v => ({ value: v.id, label: v.apelido }))} />
            <Select label="Tipo" value={tipo} onChange={e => setTipo(e.target.value as TipoManutencao)} options={TIPOS} />
            <Input label="Descrição (opcional)" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Óleo 5W30" />
            <Input label="KM Referência" type="number" step="0.1" value={kmReferencia} onChange={e => setKmReferencia(e.target.value)} required placeholder="Ex: 45000" />
            <Input label="Data" type="date" value={data} onChange={e => setData(e.target.value)} required />
            <Input label="Valor (R$)" type="number" step="0.01" min="0.01" value={valor} onChange={e => setValor(e.target.value)} required placeholder="Ex: 250.00" />
            <Input label="Próximo KM (opcional)" type="number" step="0.1" value={proximoKm} onChange={e => setProximoKm(e.target.value)} placeholder="Ex: 50000" />
            <Input label="Próxima Data (opcional)" type="date" value={proximaData} onChange={e => setProximaData(e.target.value)} />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="submit" fullWidth><Save size={16} /> Salvar</Button>
              <Button variant="ghost" onClick={limparForm}><X size={16} /></Button>
            </div>
          </form>
        </Card>
      )}

      {/* Formulário de alerta */}
      {mostrarAlertaForm && (
        <Card style={{ marginBottom: 'var(--space-md)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 'var(--space-md)' }}>Criar Alerta por Data</h3>
          <form onSubmit={handleAlerta}>
            <Select label="Veículo" value={veiculoId} onChange={e => setVeiculoId(Number(e.target.value))}
              options={veiculos.map(v => ({ value: v.id, label: v.apelido }))} />
            <Select label="Tipo de Manutenção" value={tipo} onChange={e => setTipo(e.target.value as TipoManutencao)} options={TIPOS} />
            <Input label="Alertar a partir de" type="date" value={proximaData} onChange={e => setProximaData(e.target.value)} required />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="submit" fullWidth><Save size={16} /> Criar Alerta</Button>
              <Button variant="ghost" onClick={limparForm}><X size={16} /></Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-md)' }}>
        {[
          { key: 'historico', label: 'Histórico', icon: Wrench },
          { key: 'alertas', label: 'Alertas', icon: AlertTriangle },
          { key: 'depreciacao', label: 'Depreciação', icon: TrendingDown },
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

      {/* Histórico */}
      {tab === 'historico' && (
        manutencoes.length === 0 ? (
          <EmptyState icon={<Wrench size={48} />} title="Nenhuma manutenção" description="Registre a primeira manutenção" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {manutencoes.map((m, i) => (
              <Card key={m.id} style={{ animationDelay: `${i * 50}ms` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600 }}>{tipoLabel[m.tipo]}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{m.veiculoApelido} • {m.kmReferencia} km • {fmtData(m.data)}</p>
                    {m.descricao && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{m.descricao}</p>}
                    {m.proximoKm && <p style={{ fontSize: 12, color: 'var(--info)', marginTop: 4 }}>Próximo: {m.proximoKm} km</p>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--danger)' }}>{fmtMoeda(m.valor)}</p>
                    <button onClick={() => handleExcluir(m.veiculoId, m.id)}
                      style={{ marginTop: 4, padding: 4, background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', cursor: 'pointer' }}>
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
          <EmptyState icon={<AlertTriangle size={48} />} title="Nenhum alerta" description="Crie alertas para manutenções futuras" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {alertas.map((a, i) => (
              <Card key={a.id} style={{ animationDelay: `${i * 50}ms` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600 }}>{tipoLabel[a.tipo]}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{a.veiculoApelido}</p>
                    <p style={{ fontSize: 12, color: 'var(--info)' }}>A partir de {fmtData(a.alertarAposData)}</p>
                  </div>
                  <button onClick={() => handleDesativarAlerta(a.veiculoId, a.id)}
                    style={{ padding: 6, background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', cursor: 'pointer' }}>
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
          <EmptyState icon={<TrendingDown size={48} />} title="Nenhum veículo" description="Cadastre veículos com valor de compra" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {depreciacoes.map((d, i) => (
              <Card key={d.veiculoId} style={{ animationDelay: `${i * 50}ms` }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{d.veiculoApelido}</h3>
                {d.valorCompra ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 8 }}>
                      <div style={{ padding: 8, background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Valor Compra</p>
                        <p style={{ fontSize: 14, fontWeight: 600 }}>{fmtMoeda(d.valorCompra)}</p>
                      </div>
                      <div style={{ padding: 8, background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Valor Atual Est.</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{d.valorAtualEstimado ? fmtMoeda(d.valorAtualEstimado) : '—'}</p>
                      </div>
                      <div style={{ padding: 8, background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Depreciação Total</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--danger)' }}>{fmtMoeda(d.depreciacaoTotal)}</p>
                      </div>
                      <div style={{ padding: 8, background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Depreciação/Dia</p>
                        <p style={{ fontSize: 14, fontWeight: 600 }}>{fmtMoeda(d.depreciacaoDiaria)}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.diasDesdeAquisicao} dias desde aquisição</p>
                  </>
                ) : (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Cadastre o valor de compra e data de aquisição do veículo para calcular a depreciação.</p>
                )}
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  )
}
