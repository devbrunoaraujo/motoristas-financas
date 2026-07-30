import { useState, useEffect } from 'react'
import * as combustivelService from '../../services/combustivelService'
import type { PrecoCombustivelResponse, TipoCombustivel } from '../../types/combustivel'
import { Card, Button, Input, Select, PageHeader, EmptyState } from '../../components/ui'
import { Fuel, Plus, Trash2, Save, X } from 'lucide-react'

const TIPOS: { value: TipoCombustivel; label: string }[] = [
  { value: 'GASOLINA', label: 'Gasolina' }, { value: 'ETANOL', label: 'Etanol' },
  { value: 'DIESEL', label: 'Diesel' }, { value: 'GNV', label: 'GNV' }, { value: 'ELETRICO', label: 'Elétrico' },
]

export default function Combustivel() {
  const [precos, setPrecos] = useState<PrecoCombustivelResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)

  const [tipoCombustivel, setTipoCombustivel] = useState<TipoCombustivel>('GASOLINA')
  const [preco, setPreco] = useState('')
  const [vigenteDesde, setVigenteDesde] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => { carregarPrecos() }, [])

  async function carregarPrecos() {
    try { setCarregando(true); setPrecos(await combustivelService.listarPrecos()) }
    catch { setErro('Erro ao carregar preços') } finally { setCarregando(false) }
  }

  function limparForm() {
    setTipoCombustivel('GASOLINA'); setPreco(''); setVigenteDesde(new Date().toISOString().split('T')[0]); setMostrarForm(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro('')
    try {
      await combustivelService.criarPreco({ tipoCombustivel, preco: Number(preco), vigenteDesde })
      limparForm(); carregarPrecos()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Excluir este preço?')) return
    try { await combustivelService.excluirPreco(id); carregarPrecos() } catch { setErro('Erro ao excluir') }
  }

  function fmtMoeda(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
  function fmtData(d: string) { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') }

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 600, margin: '0 auto' }}>
      <PageHeader title="Preços de Combustível" action={
        !mostrarForm && <Button size="sm" onClick={() => setMostrarForm(true)}><Plus size={16} /> Novo</Button>
      } />

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{erro}</div>}

      {mostrarForm && (
        <Card style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-md)' }}>Novo Preço</h2>
          <form onSubmit={handleSubmit}>
            <Select label="Combustível" value={tipoCombustivel} onChange={e => setTipoCombustivel(e.target.value as TipoCombustivel)} options={TIPOS} />
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
        <EmptyState icon={<Fuel size={48} />} title="Nenhum preço cadastrado" description="Cadastre o preço do combustível" />
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
