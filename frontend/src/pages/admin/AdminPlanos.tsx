import { useState, useEffect } from 'react'
import * as adminService from '../../services/adminService'
import type { Plano, PlanoRequest } from '../../types/admin'

export default function AdminPlanos() {
  const [planos, setPlanos] = useState<Plano[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState<Plano | null>(null)

  const [nome, setNome] = useState('')
  const [valorMensal, setValorMensal] = useState('')
  const [limiteVeiculos, setLimiteVeiculos] = useState('1')
  const [descricao, setDescricao] = useState('')

  useEffect(() => {
    carregarPlanos()
  }, [])

  async function carregarPlanos() {
    try {
      setCarregando(true)
      const data = await adminService.listarPlanos()
      setPlanos(data)
    } catch (err: any) {
      setErro('Erro ao carregar planos')
    } finally {
      setCarregando(false)
    }
  }

  function limparForm() {
    setNome('')
    setValorMensal('')
    setLimiteVeiculos('1')
    setDescricao('')
    setEditando(null)
    setMostrarForm(false)
  }

  function abrirEdicao(plano: Plano) {
    setEditando(plano)
    setNome(plano.nome)
    setValorMensal(String(plano.valorMensal))
    setLimiteVeiculos(String(plano.limiteVeiculos))
    setDescricao(plano.descricaoFuncionalidades || '')
    setMostrarForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    const dados: PlanoRequest = {
      nome,
      valorMensal: Number(valorMensal),
      limiteVeiculos: Number(limiteVeiculos),
      descricaoFuncionalidades: descricao || undefined
    }

    try {
      if (editando) {
        await adminService.atualizarPlano(editando.id, dados)
      } else {
        await adminService.criarPlano(dados)
      }
      limparForm()
      carregarPlanos()
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || 'Erro ao salvar plano')
    }
  }

  async function handleInativar(id: number) {
    if (!confirm('Deseja realmente inativar este plano?')) return

    try {
      await adminService.inativarPlano(id)
      carregarPlanos()
    } catch (err: any) {
      setErro('Erro ao inativar plano')
    }
  }

  function formatarLimite(limite: number) {
    return limite === -1 ? 'Ilimitado' : String(limite)
  }

  if (carregando) return <div>Carregando...</div>

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
      <h1 style={{ marginBottom: 24 }}>Planos</h1>

      {erro && <p style={{ color: 'red', marginBottom: 12 }}>{erro}</p>}

      {!mostrarForm && (
        <button
          onClick={() => setMostrarForm(true)}
          style={{ marginBottom: 20, padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          + Novo Plano
        </button>
      )}

      {mostrarForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20, padding: 16, border: '1px solid #ddd', borderRadius: 4 }}>
          <h2>{editando ? 'Editar Plano' : 'Novo Plano'}</h2>

          <div style={{ marginBottom: 12 }}>
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Valor Mensal (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={valorMensal}
              onChange={e => setValorMensal(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Limite de Veículos (-1 = ilimitado)</label>
            <input
              type="number"
              min="-1"
              value={limiteVeiculos}
              onChange={e => setLimiteVeiculos(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Descrição das Funcionalidades</label>
            <textarea
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
              {editando ? 'Salvar' : 'Criar'}
            </button>
            <button type="button" onClick={limparForm} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {planos.map(plano => (
          <div key={plano.id} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, opacity: plano.ativo ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>{plano.nome}</h3>
                <p style={{ color: '#666' }}>R$ {plano.valorMensal}/mês — {formatarLimite(plano.limiteVeiculos)} veículo(s)</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => abrirEdicao(plano)} style={{ padding: '6px 12px', background: '#ffc107', border: 'none', cursor: 'pointer' }}>
                  Editar
                </button>
                {plano.ativo && (
                  <button onClick={() => handleInativar(plano.id)} style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Inativar
                  </button>
                )}
              </div>
            </div>
            {plano.descricaoFuncionalidades && (
              <p style={{ marginTop: 8, fontSize: 14, color: '#666' }}>{plano.descricaoFuncionalidades}</p>
            )}
            {!plano.ativo && <span style={{ fontSize: 12, color: '#dc3545' }}>Inativo</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
