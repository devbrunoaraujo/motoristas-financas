import { useState, useEffect } from 'react'
import * as registroService from '../../services/registroService'
import * as veiculoService from '../../services/veiculoService'
import type { RegistroDiaResponse, Plataforma, GanhoPlataformaRequest } from '../../types/registro'
import type { VeiculoResponse } from '../../types/veiculo'
import { Card, Button, Input, Select, PageHeader, Badge, EmptyState } from '../../components/ui'
import { Plus, Trash2, Edit3, Calendar, Save, X, FileText } from 'lucide-react'

const PLATAFORMAS: Plataforma[] = ['UBER', 'NOVENTA_E_NOVE', 'IFOOD', 'INDRIVE', 'OUTRA']

export default function RegistroDia() {
  const [registros, setRegistros] = useState<RegistroDiaResponse[]>([])
  const [veiculos, setVeiculos] = useState<VeiculoResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState<RegistroDiaResponse | null>(null)

  const [veiculoId, setVeiculoId] = useState<number>(0)
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [kmRodado, setKmRodado] = useState('')
  const [ganhos, setGanhos] = useState<GanhoPlataformaRequest[]>([{ plataforma: 'UBER', valor: 0 }])

  useEffect(() => { carregarDados() }, [])

  async function carregarDados() {
    try {
      setCarregando(true); setErro('')
      const [regs, veics] = await Promise.all([registroService.listarRegistros(), veiculoService.listarVeiculos()])
      setRegistros(regs); setVeiculos(veics)
      if (veics.length > 0 && veiculoId === 0) setVeiculoId(veics[0].id)
    } catch { setErro('Erro ao carregar dados') } finally { setCarregando(false) }
  }

  function limparForm() {
    setKmRodado(''); setGanhos([{ plataforma: 'UBER', valor: 0 }])
    setData(new Date().toISOString().split('T')[0]); setEditando(null)
    setMostrarForm(false); setErro(''); setSucesso('')
  }

  function abrirEdicao(reg: RegistroDiaResponse) {
    setEditando(reg); setVeiculoId(reg.veiculoId); setData(reg.data)
    setKmRodado(String(reg.kmRodado))
    setGanhos(reg.ganhos.map(g => ({ plataforma: g.plataforma, valor: g.valor })))
    setMostrarForm(true); setErro(''); setSucesso('')
  }

  function atualizarGanho(i: number, campo: 'plataforma' | 'valor', val: any) {
    const g = [...ganhos]; g[i] = { ...g[i], [campo]: campo === 'valor' ? Number(val) : val }; setGanhos(g)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setSucesso('')
    try {
      await registroService.criarRegistro({ veiculoId, data, kmRodado: Number(kmRodado), ganhos: ganhos.filter(g => g.valor > 0) })
      setSucesso(editando ? 'Registro atualizado!' : 'Registro salvo!'); limparForm(); carregarDados()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Excluir este registro?')) return
    try { await registroService.excluirRegistro(id); carregarDados() } catch { setErro('Erro ao excluir') }
  }

  function fmtMoeda(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
  function fmtData(d: string) { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') }

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 600, margin: '0 auto' }}>
      <PageHeader title="Registro do Dia" action={
        !mostrarForm && <Button size="sm" onClick={() => { setMostrarForm(true); setEditando(null) }} disabled={veiculos.length === 0}>
          <Plus size={16} /> Novo
        </Button>
      } />

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', border: '1px solid rgba(225,112,85,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{erro}</div>}
      {sucesso && <div style={{ padding: '10px 14px', background: 'rgba(0,184,148,0.1)', border: '1px solid rgba(0,184,148,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--accent)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{sucesso}</div>}

      {veiculos.length === 0 && <EmptyState icon={<FileText size={48} />} title="Cadastre um veículo primeiro" />}

      {mostrarForm && (
        <Card style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-md)' }}>{editando ? 'Editar Registro' : 'Novo Registro'}</h2>
          <form onSubmit={handleSubmit}>
            <Select label="Veículo" value={veiculoId} onChange={e => setVeiculoId(Number(e.target.value))}
              options={veiculos.map(v => ({ value: v.id, label: v.apelido }))} />

            <Input label="Data" type="date" value={data} onChange={e => setData(e.target.value)} required disabled={!!editando} />

            <Input label="KM Rodado" type="number" step="0.1" min="0.1" value={kmRodado} onChange={e => setKmRodado(e.target.value)} required placeholder="Ex: 150" />

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Ganhos por Plataforma</label>
              {ganhos.map((ganho, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <select value={ganho.plataforma} onChange={e => atualizarGanho(i, 'plataforma', e.target.value)}
                    style={{ flex: 1, padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 14 }}>
                    {PLATAFORMAS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <input type="number" step="0.01" min="0.01" placeholder="Valor" value={ganho.valor || ''}
                    onChange={e => atualizarGanho(i, 'valor', e.target.value)}
                    style={{ flex: 1, padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 14 }} />
                  {ganhos.length > 1 && (
                    <button type="button" onClick={() => setGanhos(ganhos.filter((_, j) => j !== i))}
                      style={{ padding: '10px', background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 'var(--radius-md)', color: 'var(--danger)', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setGanhos([...ganhos, { plataforma: 'UBER', valor: 0 }])}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'none', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>
                <Plus size={14} /> Adicionar plataforma
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="submit" fullWidth><Save size={16} /> {editando ? 'Atualizar' : 'Salvar'}</Button>
              <Button variant="ghost" onClick={limparForm}><X size={16} /></Button>
            </div>
          </form>
        </Card>
      )}

      {registros.length === 0 && !mostrarForm ? (
        <EmptyState icon={<Calendar size={48} />} title="Nenhum registro" description="Registre seu primeiro dia de trabalho" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {registros.map((reg, i) => (
            <Card key={reg.id} style={{ animationDelay: `${i * 50}ms` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{fmtData(reg.data)}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{reg.veiculoApelido} • {reg.kmRodado} km</p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => abrirEdicao(reg)} style={{ padding: 6, background: 'var(--bg-input)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}><Edit3 size={14} /></button>
                  <button onClick={() => handleExcluir(reg.id)} style={{ padding: 6, background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                <div style={{ textAlign: 'center', padding: 8, background: 'rgba(0,184,148,0.05)', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ganho</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{fmtMoeda(reg.ganhoBrutoTotal)}</p>
                </div>
                <div style={{ textAlign: 'center', padding: 8, background: 'rgba(225,112,85,0.05)', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Combustível</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--danger)' }}>{fmtMoeda(reg.gastoCombustivelCalculado)}</p>
                </div>
                <div style={{ textAlign: 'center', padding: 8, background: 'rgba(0,184,148,0.05)', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Lucro</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: reg.lucroLiquido >= 0 ? 'var(--accent)' : 'var(--danger)' }}>{fmtMoeda(reg.lucroLiquido)}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {reg.ganhos.map(g => (
                  <Badge key={g.id} variant="success">{g.plataforma}: {fmtMoeda(g.valor)}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
