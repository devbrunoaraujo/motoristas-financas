import { useState, useEffect } from 'react'
import * as registroService from '../../services/registroService'
import * as veiculoService from '../../services/veiculoService'
import type { RegistroDiaRequest, RegistroDiaResponse, Plataforma, GanhoPlataformaRequest } from '../../types/registro'
import type { VeiculoResponse } from '../../types/veiculo'

const PLATAFORMAS: Plataforma[] = ['UBER', 'NOVENTA_E_NOVE', 'IFOOD', 'INDRIVE', 'OUTRA']

export default function RegistroDia() {
  const [registros, setRegistros] = useState<RegistroDiaResponse[]>([])
  const [veiculos, setVeiculos] = useState<VeiculoResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)

  const [veiculoId, setVeiculoId] = useState<number>(0)
  const [kmRodado, setKmRodado] = useState('')
  const [ganhos, setGanhos] = useState<GanhoPlataformaRequest[]>([{ plataforma: 'UBER', valor: 0 }])

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      setCarregando(true)
      const [regs, veics] = await Promise.all([
        registroService.listarRegistros(),
        veiculoService.listarVeiculos()
      ])
      setRegistros(regs)
      setVeiculos(veics)
      if (veics.length > 0 && veiculoId === 0) {
        setVeiculoId(veics[0].id)
      }
    } catch (err: any) {
      setErro('Erro ao carregar dados')
    } finally {
      setCarregando(false)
    }
  }

  function limparForm() {
    setKmRodado('')
    setGanhos([{ plataforma: 'UBER', valor: 0 }])
    setMostrarForm(false)
  }

  function adicionarGanho() {
    setGanhos([...ganhos, { plataforma: 'UBER', valor: 0 }])
  }

  function removerGanho(index: number) {
    setGanhos(ganhos.filter((_, i) => i !== index))
  }

  function atualizarGanho(index: number, campo: 'plataforma' | 'valor', valor: any) {
    const novosGanhos = [...ganhos]
    novosGanhos[index] = { ...novosGanhos[index], [campo]: campo === 'valor' ? Number(valor) : valor }
    setGanhos(novosGanhos)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    const dados: RegistroDiaRequest = {
      veiculoId,
      kmRodado: Number(kmRodado),
      ganhos: ganhos.filter(g => g.valor > 0)
    }

    try {
      await registroService.criarRegistro(dados)
      limparForm()
      carregarDados()
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || 'Erro ao salvar registro')
    }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Deseja realmente excluir este registro?')) return

    try {
      await registroService.excluirRegistro(id)
      carregarDados()
    } catch (err: any) {
      setErro('Erro ao excluir registro')
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
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Registro do Dia</h1>

      {erro && <p style={{ color: 'red', marginBottom: 12 }}>{erro}</p>}

      {!mostrarForm && (
        <button
          onClick={() => setMostrarForm(true)}
          disabled={veiculos.length === 0}
          style={{ marginBottom: 20, padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          + Novo Registro
        </button>
      )}

      {veiculos.length === 0 && (
        <p style={{ color: '#856404', background: '#fff3cd', padding: 12, borderRadius: 4 }}>
          Cadastre um veículo primeiro para poder registrar seu dia.
        </p>
      )}

      {mostrarForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20, padding: 16, border: '1px solid #ddd', borderRadius: 4 }}>
          <h2>Novo Registro</h2>

          <div style={{ marginBottom: 12 }}>
            <label>Veículo</label>
            <select
              value={veiculoId}
              onChange={e => setVeiculoId(Number(e.target.value))}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            >
              {veiculos.map(v => (
                <option key={v.id} value={v.id}>{v.apelido}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>KM Rodado (odômetro)</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={kmRodado}
              onChange={e => setKmRodado(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Ganhos por Plataforma</label>
            {ganhos.map((ganho, index) => (
              <div key={index} style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                <select
                  value={ganho.plataforma}
                  onChange={e => atualizarGanho(index, 'plataforma', e.target.value)}
                  style={{ flex: 1, padding: 8 }}
                >
                  {PLATAFORMAS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Valor"
                  value={ganho.valor || ''}
                  onChange={e => atualizarGanho(index, 'valor', e.target.value)}
                  style={{ flex: 1, padding: 8 }}
                />
                {ganhos.length > 1 && (
                  <button type="button" onClick={() => removerGanho(index)} style={{ padding: '8px 12px', background: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    X
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={adicionarGanho} style={{ marginTop: 8, padding: '6px 12px', background: '#17a2b8', color: '#fff', border: 'none', cursor: 'pointer' }}>
              + Adicionar Plataforma
            </button>
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

      {registros.length === 0 ? (
        <p>Nenhum registro cadastrado.</p>
      ) : (
        <div>
          {registros.map(reg => (
            <div key={reg.id} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 4, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{formatarData(reg.data)} — {reg.veiculoApelido}</h3>
                <button onClick={() => handleExcluir(reg.id)} style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}>
                  Excluir
                </button>
              </div>
              <p>KM Rodado: {reg.kmRodado} km</p>
              <p>Ganho Bruto: {formatarMoeda(reg.ganhoBrutoTotal)}</p>
              <p>Gasto Combustível: {formatarMoeda(reg.gastoCombustivelCalculado)}</p>
              <p><strong>Lucro Líquido: {formatarMoeda(reg.lucroLiquido)}</strong></p>
              <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
                {reg.ganhos.map(g => (
                  <span key={g.id} style={{ marginRight: 12 }}>{g.plataforma}: {formatarMoeda(g.valor)}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
