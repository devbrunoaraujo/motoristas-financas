import { useState, useEffect } from 'react'
import * as veiculoService from '../../services/veiculoService'
import type { VeiculoRequest, VeiculoResponse, TipoCombustivel } from '../../types/veiculo'
import { Card, Button, Input, Select, PageHeader, EmptyState } from '../../components/ui'
import { Car, Plus, Edit3, Trash2, Save, X, DollarSign } from 'lucide-react'

const TIPOS: { value: TipoCombustivel; label: string }[] = [
  { value: 'GASOLINA', label: 'Gasolina' }, { value: 'ETANOL', label: 'Etanol' },
  { value: 'DIESEL', label: 'Diesel' }, { value: 'GNV', label: 'GNV' }, { value: 'ELETRICO', label: 'Elétrico' },
]

export default function Veiculos() {
  const [veiculos, setVeiculos] = useState<VeiculoResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState<VeiculoResponse | null>(null)
  const [mostrarFinanceiro, setMostrarFinanceiro] = useState(false)

  const [apelido, setApelido] = useState('')
  const [placa, setPlaca] = useState('')
  const [tipoCombustivel, setTipoCombustivel] = useState<TipoCombustivel>('GASOLINA')
  const [autonomia, setAutonomia] = useState('')
  const [valorCompra, setValorCompra] = useState('')
  const [valorRevendaEstimado, setValorRevendaEstimado] = useState('')
  const [dataAquisicao, setDataAquisicao] = useState('')
  const [kmAtual, setKmAtual] = useState('')

  useEffect(() => { carregarVeiculos() }, [])

  async function carregarVeiculos() {
    try { setCarregando(true); setVeiculos(await veiculoService.listarVeiculos()) }
    catch { setErro('Erro ao carregar veículos') } finally { setCarregando(false) }
  }

  function limparForm() {
    setApelido(''); setPlaca(''); setTipoCombustivel('GASOLINA'); setAutonomia('')
    setValorCompra(''); setValorRevendaEstimado(''); setDataAquisicao(''); setKmAtual('')
    setEditando(null); setMostrarForm(false); setMostrarFinanceiro(false)
  }

  function abrirEdicao(v: VeiculoResponse) {
    setEditando(v); setApelido(v.apelido); setPlaca(v.placa || '')
    setTipoCombustivel(v.tipoCombustivel); setAutonomia(String(v.autonomia))
    setValorCompra(v.valorCompra ? String(v.valorCompra) : '')
    setValorRevendaEstimado(v.valorRevendaEstimado ? String(v.valorRevendaEstimado) : '')
    setDataAquisicao(v.dataAquisicao || '')
    setKmAtual(v.kmAtual ? String(v.kmAtual) : '')
    setMostrarForm(true); setMostrarFinanceiro(!!v.valorCompra)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro('')
    const dados: VeiculoRequest = {
      apelido, placa: placa || undefined, tipoCombustivel, autonomia: Number(autonomia),
      valorCompra: valorCompra ? Number(valorCompra) : undefined,
      valorRevendaEstimado: valorRevendaEstimado ? Number(valorRevendaEstimado) : undefined,
      dataAquisicao: dataAquisicao || undefined,
      kmAtual: kmAtual ? Number(kmAtual) : undefined,
    }
    try {
      editando ? await veiculoService.atualizarVeiculo(editando.id, dados) : await veiculoService.criarVeiculo(dados)
      limparForm(); carregarVeiculos()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  async function handleInativar(id: number) {
    if (!confirm('Inativar este veículo?')) return
    try { await veiculoService.inativarVeiculo(id); carregarVeiculos() } catch { setErro('Erro ao inativar') }
  }

  function fmtMoeda(v?: number) { return v ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—' }
  function fmtData(d?: string) { return d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '—' }

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 600, margin: '0 auto' }}>
      <PageHeader title="Veículos" action={
        !mostrarForm && <Button size="sm" onClick={() => setMostrarForm(true)}><Plus size={16} /> Novo</Button>
      } />

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{erro}</div>}

      {mostrarForm && (
        <Card style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-md)' }}>{editando ? 'Editar Veículo' : 'Novo Veículo'}</h2>
          <form onSubmit={handleSubmit}>
            <Input label="Apelido" value={apelido} onChange={e => setApelido(e.target.value)} placeholder="Ex: Onix 2022" required />
            <Input label="Placa (opcional)" value={placa} onChange={e => setPlaca(e.target.value)} placeholder="ABC1D23" />
            <Select label="Combustível" value={tipoCombustivel} onChange={e => setTipoCombustivel(e.target.value as TipoCombustivel)} options={TIPOS} />
            <Input label="Autonomia (km/l)" type="number" step="0.1" min="0.1" value={autonomia} onChange={e => setAutonomia(e.target.value)} required placeholder="Ex: 12.5" />

            {/* Seção financeira (depreciação) */}
            <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => setMostrarFinanceiro(!mostrarFinanceiro)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginBottom: 'var(--space-md)' }}
              >
                <DollarSign size={16} />
                {mostrarFinanceiro ? 'Ocultar dados financeiros' : 'Dados financeiros (para depreciação)'}
              </button>

              {mostrarFinanceiro && (
                <>
                  <Input label="Valor de Compra (R$)" type="number" step="0.01" value={valorCompra} onChange={e => setValorCompra(e.target.value)} placeholder="Ex: 50000.00" />
                  <Input label="Valor de Revenda Estimado (R$)" type="number" step="0.01" value={valorRevendaEstimado} onChange={e => setValorRevendaEstimado(e.target.value)} placeholder="Ex: 35000.00" />
                  <Input label="Data de Aquisição" type="date" value={dataAquisicao} onChange={e => setDataAquisicao(e.target.value)} />
                  <Input label="KM Atual" type="number" step="0.1" value={kmAtual} onChange={e => setKmAtual(e.target.value)} placeholder="Ex: 45000" />
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 'var(--space-md)' }}>
              <Button type="submit" fullWidth><Save size={16} /> {editando ? 'Salvar' : 'Cadastrar'}</Button>
              <Button variant="ghost" onClick={limparForm}><X size={16} /></Button>
            </div>
          </form>
        </Card>
      )}

      {veiculos.length === 0 && !mostrarForm ? (
        <EmptyState icon={<Car size={48} />} title="Nenhum veículo" description="Cadastre seu primeiro veículo" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {veiculos.map((v, i) => (
            <Card key={v.id} style={{ animationDelay: `${i * 50}ms` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 600 }}>{v.apelido}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{v.placa || 'Sem placa'} • {v.tipoCombustivel} • {v.autonomia} km/l</p>
                  {v.valorCompra && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                      Compra: {fmtMoeda(v.valorCompra)} • Aquisição: {fmtData(v.dataAquisicao)}
                      {v.kmAtual && ` • ${v.kmAtual} km`}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => abrirEdicao(v)} style={{ padding: 8, background: 'var(--bg-input)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}><Edit3 size={14} /></button>
                  <button onClick={() => handleInativar(v.id)} style={{ padding: 8, background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={14} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
