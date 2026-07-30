import { useState, useEffect } from 'react'
import * as veiculoService from '../../services/veiculoService'
import type { VeiculoRequest, VeiculoResponse, TipoCombustivel } from '../../types/veiculo'

const TIPOS_COMBUSTIVEL: TipoCombustivel[] = ['GASOLINA', 'ETANOL', 'DIESEL', 'GNV', 'ELETRICO']

export default function Veiculos() {
  const [veiculos, setVeiculos] = useState<VeiculoResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState<VeiculoResponse | null>(null)

  const [apelido, setApelido] = useState('')
  const [placa, setPlaca] = useState('')
  const [tipoCombustivel, setTipoCombustivel] = useState<TipoCombustivel>('GASOLINA')
  const [autonomia, setAutonomia] = useState('')

  useEffect(() => {
    carregarVeiculos()
  }, [])

  async function carregarVeiculos() {
    try {
      setCarregando(true)
      const data = await veiculoService.listarVeiculos()
      setVeiculos(data)
    } catch (err: any) {
      setErro('Erro ao carregar veículos')
    } finally {
      setCarregando(false)
    }
  }

  function limparForm() {
    setApelido('')
    setPlaca('')
    setTipoCombustivel('GASOLINA')
    setAutonomia('')
    setEditando(null)
    setMostrarForm(false)
  }

  function abrirEdicao(veiculo: VeiculoResponse) {
    setEditando(veiculo)
    setApelido(veiculo.apelido)
    setPlaca(veiculo.placa || '')
    setTipoCombustivel(veiculo.tipoCombustivel)
    setAutonomia(String(veiculo.autonomia))
    setMostrarForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    const dados: VeiculoRequest = {
      apelido,
      placa: placa || undefined,
      tipoCombustivel,
      autonomia: Number(autonomia)
    }

    try {
      if (editando) {
        await veiculoService.atualizarVeiculo(editando.id, dados)
      } else {
        await veiculoService.criarVeiculo(dados)
      }
      limparForm()
      carregarVeiculos()
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || 'Erro ao salvar veículo')
    }
  }

  async function handleInativar(id: number) {
    if (!confirm('Deseja realmente inativar este veículo?')) return

    try {
      await veiculoService.inativarVeiculo(id)
      carregarVeiculos()
    } catch (err: any) {
      setErro('Erro ao inativar veículo')
    }
  }

  if (carregando) return <div>Carregando...</div>

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Meus Veículos</h1>

      {erro && <p style={{ color: 'red', marginBottom: 12 }}>{erro}</p>}

      {!mostrarForm && (
        <button
          onClick={() => setMostrarForm(true)}
          style={{ marginBottom: 20, padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          + Novo Veículo
        </button>
      )}

      {mostrarForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20, padding: 16, border: '1px solid #ddd', borderRadius: 4 }}>
          <h2>{editando ? 'Editar Veículo' : 'Novo Veículo'}</h2>

          <div style={{ marginBottom: 12 }}>
            <label>Apelido</label>
            <input
              type="text"
              value={apelido}
              onChange={e => setApelido(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Placa (opcional)</label>
            <input
              type="text"
              value={placa}
              onChange={e => setPlaca(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>

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
            <label>Autonomia (km/l ou km/kWh)</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={autonomia}
              onChange={e => setAutonomia(e.target.value)}
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

      {veiculos.length === 0 ? (
        <p>Nenhum veículo cadastrado.</p>
      ) : (
        <div>
          {veiculos.map(veiculo => (
            <div key={veiculo.id} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 4, marginBottom: 12 }}>
              <h3>{veiculo.apelido}</h3>
              <p>Placa: {veiculo.placa || '—'}</p>
              <p>Combustível: {veiculo.tipoCombustivel}</p>
              <p>Autonomia: {veiculo.autonomia} km/l</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={() => abrirEdicao(veiculo)} style={{ padding: '6px 12px', background: '#ffc107', border: 'none', cursor: 'pointer' }}>
                  Editar
                </button>
                <button onClick={() => handleInativar(veiculo.id)} style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}>
                  Inativar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
