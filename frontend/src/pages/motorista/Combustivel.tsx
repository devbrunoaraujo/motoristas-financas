import { useState, useEffect } from 'react'
import * as combustivelService from '../../services/combustivelService'
import type { PrecoCombustivelRequest, PrecoCombustivelResponse, TipoCombustivel } from '../../types/combustivel'

const TIPOS_COMBUSTIVEL: TipoCombustivel[] = ['GASOLINA', 'ETANOL', 'DIESEL', 'GNV', 'ELETRICO']

export default function Combustivel() {
  const [precos, setPrecos] = useState<PrecoCombustivelResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)

  const [tipoCombustivel, setTipoCombustivel] = useState<TipoCombustivel>('GASOLINA')
  const [preco, setPreco] = useState('')
  const [vigenteDesde, setVigenteDesde] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    carregarPrecos()
  }, [])

  async function carregarPrecos() {
    try {
      setCarregando(true)
      const data = await combustivelService.listarPrecos()
      setPrecos(data)
    } catch (err: any) {
      setErro('Erro ao carregar preços')
    } finally {
      setCarregando(false)
    }
  }

  function limparForm() {
    setTipoCombustivel('GASOLINA')
    setPreco('')
    setVigenteDesde(new Date().toISOString().split('T')[0])
    setMostrarForm(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    const dados: PrecoCombustivelRequest = {
      tipoCombustivel,
      preco: Number(preco),
      vigenteDesde
    }

    try {
      await combustivelService.criarPreco(dados)
      limparForm()
      carregarPrecos()
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || 'Erro ao salvar preço')
    }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Deseja realmente excluir este preço?')) return

    try {
      await combustivelService.excluirPreco(id)
      carregarPrecos()
    } catch (err: any) {
      setErro('Erro ao excluir preço')
    }
  }

  function formatarPreco(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  function formatarData(data: string) {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
  }

  if (carregando) return <div>Carregando...</div>

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Preços de Combustível</h1>

      {erro && <p style={{ color: 'red', marginBottom: 12 }}>{erro}</p>}

      {!mostrarForm && (
        <button
          onClick={() => setMostrarForm(true)}
          style={{ marginBottom: 20, padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          + Novo Preço
        </button>
      )}

      {mostrarForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20, padding: 16, border: '1px solid #ddd', borderRadius: 4 }}>
          <h2>Novo Preço de Combustível</h2>

          <div style={{ marginBottom: 12 }}>
            <label>Tipo de Combustível</label>
            <select
              value={tipoCombustivel}
              onChange={e => setTipoCombustivel(e.target.value as TipoCombustivel)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            >
              {TIPOS_COMBUSTIVEL.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Preço por litro/kWh (R$)</label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              value={preco}
              onChange={e => setPreco(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Vigente desde</label>
            <input
              type="date"
              value={vigenteDesde}
              onChange={e => setVigenteDesde(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Salvar
            </button>
            <button type="button" onClick={limparForm} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {precos.length === 0 ? (
        <p>Nenhum preço cadastrado.</p>
      ) : (
        <div>
          {precos.map(preco => (
            <div key={preco.id} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 4, marginBottom: 12 }}>
              <h3>{preco.tipoCombustivel}</h3>
              <p>Preço: {formatarPreco(preco.preco)}</p>
              <p>Vigente desde: {formatarData(preco.vigenteDesde)}</p>
              <button onClick={() => handleExcluir(preco.id)} style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}>
                Excluir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
