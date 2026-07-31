import { useState, useEffect } from 'react'
import * as combustivelService from '../../services/combustivelService'
import * as veiculoService from '../../services/veiculoService'
import type { PrecoCombustivelResponse, TipoCombustivel } from '../../types/combustivel'
import type { VeiculoResponse } from '../../types/veiculo'
import { Card, Button, Input, Select, EmptyState } from '../../components/ui'
import { Fuel, Plus, Trash2, Save, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Combustivel() {
  const [precos, setPrecos] = useState<PrecoCombustivelResponse[]>([])
  const [veiculos, setVeiculos] = useState<VeiculoResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)

  const [tipoCombustivel, setTipoCombustivel] = useState<TipoCombustivel>('GASOLINA')
  const [preco, setPreco] = useState('')
  const [vigenteDesde, setVigenteDesde] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => { carregarDados() }, [])

  async function carregarDados() {
    try {
      setCarregando(true)
      const [p, v] = await Promise.all([combustivelService.listarPrecos(), veiculoService.listarVeiculos()])
      setPrecos(p); setVeiculos(v)
    } catch { setErro('Erro ao carregar dados') } finally { setCarregando(false) }
  }

  function limparForm() {
    setTipoCombustivel('GASOLINA'); setPreco(''); setVigenteDesde(new Date().toISOString().split('T')[0]); setMostrarForm(false)
  }

  // Verificar se já existe preço para o tipo de combustível do veículo
  function tiposDisponiveis(): TipoCombustivel[] {
    const tiposDosVeiculos = [...new Set(veiculos.map(v => v.tipoCombustivel))]
    // Filtrar tipos que já têm preço ativo
    return tiposDosVeiculos.filter(tipo => !precos.some(p => p.tipoCombustivel === tipo))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setSucesso('')
    try {
      await combustivelService.criarPreco({ tipoCombustivel, preco: Number(preco), vigenteDesde })
      setSucesso('Preço cadastrado!'); limparForm(); carregarDados()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Excluir este preço?')) return
    try { await combustivelService.excluirPreco(id); carregarDados() } catch { setErro('Erro ao excluir') }
  }

  function fmtMoeda(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
  function fmtData(d: string) { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') }

  const tiposDispon = tiposDisponiveis()

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
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Preços de Combustível</h1>
      </div>

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{erro}</div>}
      {sucesso && <div style={{ padding: '10px 14px', background: 'rgba(0,184,148,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{sucesso}</div>}

      {!mostrarForm && (
        <Button size="sm" onClick={() => { setMostrarForm(true); if (tiposDispon.length > 0) setTipoCombustivel(tiposDispon[0]) }} disabled={tiposDispon.length === 0}>
          <Plus size={16} /> {tiposDispon.length === 0 ? 'Todos os tipos cadastrados' : 'Novo Preço'}
        </Button>
      )}

      {tiposDispon.length === 0 && !mostrarForm && precos.length > 0 && (
        <div style={{ padding: 12, background: 'rgba(0,184,148,0.1)', borderRadius: 'var(--radius-md)', marginTop: 12, marginBottom: 'var(--space-md)' }}>
          <p style={{ color: 'var(--accent)', fontSize: 14 }}>Todos os combustíveis dos seus veículos já têm preço cadastrado. Para cadastrar um novo tipo, primeiro altere o tipo de combustível do veículo.</p>
        </div>
      )}

      {mostrarForm && (
        <Card style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-md)' }}>Novo Preço</h2>
          <form onSubmit={handleSubmit}>
            <Select label="Combustível" value={tipoCombustivel} onChange={e => setTipoCombustivel(e.target.value as TipoCombustivel)}
              options={tiposDispon.map(t => ({ value: t, label: t }))} />
            <Input label="Preço por litro (R$)" type="number" step="0.001" min="0.001" value={preco} onChange={e => setPreco(e.target.value)} required placeholder="Ex: 5.899" />
            <Input label="Vigente desde" type="date" value={vigenteDesde} onChange={e => setVigenteDesde(e.target.value)} required />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="submit" fullWidth><Save size={16} /> Salvar</Button>
              <Button variant="ghost" onClick={limparForm}><X size={16} /></Button>
            </div>
          </form>
        </Card>
      )}

      {precos.length === 0 && !mostrarForm ? (
        <EmptyState icon={<Fuel size={48} />} title="Nenhum preço cadastrado" description="Cadastre o preço do combustível do seu veículo" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {precos.map((p, i) => (
            <Card key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', animationDelay: `${i * 50}ms` }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600 }}>{p.tipoCombustivel}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Desde {fmtData(p.vigenteDesde)}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{fmtMoeda(p.preco)}</p>
                <button onClick={() => handleExcluir(p.id)} style={{ padding: 6, background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={14} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
