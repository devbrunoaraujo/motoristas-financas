import { useState, useEffect } from 'react'
import * as despesaService from '../../services/despesaService'
import type { DespesaRequest, DespesaResponse, CategoriaDespesa } from '../../types/despesa'

const CATEGORIAS: CategoriaDespesa[] = ['MANUTENCAO', 'ALIMENTACAO', 'LIMPEZA', 'SEGURO', 'OUTROS']

export default function Despesas() {
  const [despesas, setDespesas] = useState<DespesaResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState<DespesaResponse | null>(null)

  const [categoria, setCategoria] = useState<CategoriaDespesa>('OUTROS')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    carregarDespesas()
  }, [])

  async function carregarDespesas() {
    try {
      setCarregando(true)
      const data = await despesaService.listarDespesas()
      setDespesas(data)
    } catch (err: any) {
      setErro('Erro ao carregar despesas')
    } finally {
      setCarregando(false)
    }
  }

  function limparForm() {
    setCategoria('OUTROS')
    setDescricao('')
    setValor('')
    setData(new Date().toISOString().split('T')[0])
    setEditando(null)
    setMostrarForm(false)
  }

  function abrirEdicao(despesa: DespesaResponse) {
    setEditando(despesa)
    setCategoria(despesa.categoria)
    setDescricao(despesa.descricao || '')
    setValor(String(despesa.valor))
    setData(despesa.data)
    setMostrarForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    const dados: DespesaRequest = {
      categoria,
      descricao: descricao || undefined,
      valor: Number(valor),
      data
    }

    try {
      if (editando) {
        await despesaService.atualizarDespesa(editando.id, dados)
      } else {
        await despesaService.criarDespesa(dados)
      }
      limparForm()
      carregarDespesas()
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || 'Erro ao salvar despesa')
    }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Deseja realmente excluir esta despesa?')) return

    try {
      await despesaService.excluirDespesa(id)
      carregarDespesas()
    } catch (err: any) {
      setErro('Erro ao excluir despesa')
    }
  }

  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  function formatarData(data: string) {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
  }

  if (carregando) return <div>Carregando...</div>

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Despesas</h1>

      {erro && <p style={{ color: 'red', marginBottom: 12 }}>{erro}</p>}

      {!mostrarForm && (
        <button
          onClick={() => setMostrarForm(true)}
          style={{ marginBottom: 20, padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          + Nova Despesa
        </button>
      )}

      {mostrarForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20, padding: 16, border: '1px solid #ddd', borderRadius: 4 }}>
          <h2>{editando ? 'Editar Despesa' : 'Nova Despesa'}</h2>

          <div style={{ marginBottom: 12 }}>
            <label>Categoria</label>
            <select
              value={categoria}
              onChange={e => setCategoria(e.target.value as CategoriaDespesa)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            >
              {CATEGORIAS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Descrição (opcional)</label>
            <input
              type="text"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={valor}
              onChange={e => setValor(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Data</label>
            <input
              type="date"
              value={data}
              onChange={e => setData(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
              {editando ? 'Salvar' : 'Cadastrar'}
            </button>
            <button type="button" onClick={limparForm} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {despesas.length === 0 ? (
        <p>Nenhuma despesa cadastrada.</p>
      ) : (
        <div>
          {despesas.map(despesa => (
            <div key={despesa.id} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 4, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{despesa.categoria}</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => abrirEdicao(despesa)} style={{ padding: '6px 12px', background: '#ffc107', border: 'none', cursor: 'pointer' }}>
                    Editar
                  </button>
                  <button onClick={() => handleExcluir(despesa.id)} style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Excluir
                  </button>
                </div>
              </div>
              {despesa.descricao && <p>{despesa.descricao}</p>}
              <p>Valor: {formatarMoeda(despesa.valor)}</p>
              <p>Data: {formatarData(despesa.data)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
