import { useState, useEffect } from 'react'
import * as turnoService from '../../services/turnoService'
import * as veiculoService from '../../services/veiculoService'
import type { TurnoResponse, AnalisePlataforma } from '../../types/turno'
import type { VeiculoResponse } from '../../types/veiculo'
import { Card, Button, Input, Select, PageHeader, Badge, EmptyState } from '../../components/ui'
import { Clock, Play, StopCircle, Trash2, BarChart3 } from 'lucide-react'

export default function Turnos() {
  const [turnos, setTurnos] = useState<TurnoResponse[]>([])
  const [turnoAtivo, setTurnoAtivo] = useState<TurnoResponse | null>(null)
  const [veiculos, setVeiculos] = useState<VeiculoResponse[]>([])
  const [analise, setAnalise] = useState<AnalisePlataforma[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [tab, setTab] = useState<'turnos' | 'analise'>('turnos')

  const [veiculoId, setVeiculoId] = useState<number>(0)
  const [kmInicio, setKmInicio] = useState('')
  const [kmFim, setKmFim] = useState('')

  useEffect(() => { carregarDados() }, [])

  async function carregarDados() {
    try {
      setCarregando(true)
      const [t, ativo, v, a] = await Promise.all([
        turnoService.listarTurnos(),
        turnoService.getTurnoAtivo(),
        veiculoService.listarVeiculos(),
        turnoService.getAnalisePlataformas(30),
      ])
      setTurnos(t); setTurnoAtivo(ativo); setVeiculos(v); setAnalise(a)
      if (v.length > 0 && veiculoId === 0) setVeiculoId(v[0].id)
    } catch { setErro('Erro ao carregar dados') } finally { setCarregando(false) }
  }

  async function handleIniciar(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setSucesso('')
    try {
      await turnoService.iniciarTurno({ veiculoId, kmInicio: Number(kmInicio) })
      setSucesso('Turno iniciado!'); setKmInicio(''); carregarDados()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao iniciar turno') }
  }

  async function handleFinalizar(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setSucesso('')
    if (!turnoAtivo) return
    try {
      await turnoService.finalizarTurno(turnoAtivo.id, { kmFim: Number(kmFim) })
      setSucesso('Turno finalizado!'); setKmFim(''); carregarDados()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao finalizar turno') }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Excluir este turno?')) return
    try { await turnoService.excluirTurno(id); carregarDados() } catch { setErro('Erro ao excluir') }
  }

  function fmtHora(h?: string) { return h ? h.substring(0, 5) : '—' }
  function fmtData(d: string) { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') }
  function fmtMoeda(v?: number) { return v ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—' }

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 600, margin: '0 auto' }}>
      <PageHeader title="Turnos" />

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{erro}</div>}
      {sucesso && <div style={{ padding: '10px 14px', background: 'rgba(0,184,148,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{sucesso}</div>}

      {/* Turno ativo */}
      {turnoAtivo ? (
        <Card style={{ marginBottom: 'var(--space-md)', background: 'linear-gradient(135deg, rgba(0,184,148,0.1), rgba(116,185,255,0.05))', border: '1px solid rgba(0,184,148,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s infinite' }} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 600 }}>Turno em Andamento</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{turnoAtivo.veiculoApelido} • Iniciado às {fmtHora(turnoAtivo.horaInicio)}</p>
            </div>
          </div>
          <form onSubmit={handleFinalizar} style={{ display: 'flex', gap: 8 }}>
            <Input label="KM Final (odômetro)" type="number" step="0.1" value={kmFim} onChange={e => setKmFim(e.target.value)} required placeholder="Ex: 45200" style={{ flex: 1, marginBottom: 0 }} />
            <Button type="submit" style={{ alignSelf: 'flex-end' }}><StopCircle size={16} /> Finalizar</Button>
          </form>
        </Card>
      ) : (
        <Card style={{ marginBottom: 'var(--space-md)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 'var(--space-md)' }}>Iniciar Turno</h3>
          <form onSubmit={handleIniciar}>
            <Select label="Veículo" value={veiculoId} onChange={e => setVeiculoId(Number(e.target.value))}
              options={veiculos.map(v => ({ value: v.id, label: v.apelido }))} />
            <Input label="KM Inicial (odômetro)" type="number" step="0.1" value={kmInicio} onChange={e => setKmInicio(e.target.value)} required placeholder="Ex: 45000" />
            <Button type="submit" fullWidth disabled={veiculos.length === 0}><Play size={16} /> Iniciar Turno</Button>
          </form>
        </Card>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-md)' }}>
        {[
          { key: 'turnos', label: 'Histórico', icon: Clock },
          { key: 'analise', label: 'Análise', icon: BarChart3 },
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

      {/* Histórico de turnos */}
      {tab === 'turnos' && (
        turnos.length === 0 ? (
          <EmptyState icon={<Clock size={48} />} title="Nenhum turno" description="Inicie seu primeiro turno" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {turnos.map((t, i) => (
              <Card key={t.id} style={{ animationDelay: `${i * 50}ms` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <p style={{ fontSize: 15, fontWeight: 600 }}>{fmtData(t.data)}</p>
                      {t.emAndamento && <Badge variant="success">Em andamento</Badge>}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t.veiculoApelido} • {fmtHora(t.horaInicio)} - {fmtHora(t.horaFim)}</p>
                  </div>
                  {!t.emAndamento && (
                    <button onClick={() => handleExcluir(t.id)}
                      style={{ padding: 6, background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 8 }}>
                  <div style={{ padding: 8, background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>KM Rodado</p>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{t.kmRodado.toFixed(1)} km</p>
                  </div>
                  <div style={{ padding: 8, background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Lucro</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: (t.lucroLiquido || 0) >= 0 ? 'var(--accent)' : 'var(--danger)' }}>{fmtMoeda(t.lucroLiquido)}</p>
                  </div>
                </div>

                {!t.emAndamento && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    <div style={{ textAlign: 'center', padding: 6, background: 'rgba(0,184,148,0.05)', borderRadius: 'var(--radius-sm)' }}>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Lucro/KM</p>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{fmtMoeda(t.lucroPorKm)}</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: 6, background: 'rgba(116,185,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Lucro/Hora</p>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{fmtMoeda(t.lucroPorHora)}</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: 6, background: 'rgba(162,155,254,0.05)', borderRadius: 'var(--radius-sm)' }}>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Ganho/Hora</p>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{fmtMoeda(t.ganhoPorHora)}</p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )
      )}

      {/* Análise por plataforma */}
      {tab === 'analise' && (
        analise.length === 0 ? (
          <EmptyState icon={<BarChart3 size={48} />} title="Sem dados" description="Finalize turnos para ver a análise" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <Card>
              <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>Comparativo por Plataforma (últimos 30 dias)</h3>
              {analise.map((p) => (
                <div key={p.plataforma} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{p.plataforma}</span>
                    <span style={{ fontSize: 13, color: 'var(--accent)' }}>{p.percentualDoTotal}%</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(p.percentualDoTotal, 100)}%`,
                      background: `linear-gradient(90deg, var(--accent), var(--accent-light))`,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.diasTrabalhados} dias</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total: {fmtMoeda(p.ganhoTotal)} • Média/dia: {fmtMoeda(p.ganhoMedioPorDia)}</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )
      )}
    </div>
  )
}
