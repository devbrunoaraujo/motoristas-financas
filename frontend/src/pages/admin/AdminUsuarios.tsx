import { useState, useEffect } from 'react'
import * as adminService from '../../services/adminService'
import type { AdminUsuario, Plano } from '../../types/admin'

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([])
  const [planos, setPlanos] = useState<Plano[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [confirmando, setConfirmando] = useState<number | null>(null)
  const [planoSelecionado, setPlanoSelecionado] = useState<number>(0)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      setCarregando(true)
      const [usuariosData, planosData] = await Promise.all([
        adminService.listarUsuarios(),
        adminService.listarPlanos()
      ])
      setUsuarios(usuariosData)
      setPlanos(planosData)
      if (planosData.length > 0 && planoSelecionado === 0) {
        setPlanoSelecionado(planosData[0].id)
      }
    } catch (err: any) {
      setErro('Erro ao carregar dados')
    } finally {
      setCarregando(false)
    }
  }

  async function handleConfirmarPagamento(usuarioId: number) {
    if (!planoSelecionado) {
      setErro('Selecione um plano')
      return
    }

    try {
      await adminService.confirmarPagamento({ usuarioId, planoId: planoSelecionado })
      setConfirmando(null)
      carregarDados()
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || 'Erro ao confirmar pagamento')
    }
  }

  function formatarData(data?: string) {
    if (!data) return '—'
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
  }

  function formatarStatus(status: string) {
    const statusMap: Record<string, { texto: string; cor: string }> = {
      'TRIAL_ATIVO': { texto: 'Trial Ativo', cor: '#28a745' },
      'TRIAL_EXPIRADO': { texto: 'Trial Expirado', cor: '#ffc107' },
      'ATIVO': { texto: 'Ativo', cor: '#17a2b8' },
      'BLOQUEADO': { texto: 'Bloqueado', cor: '#dc3545' }
    }
    const s = statusMap[status] || { texto: status, cor: '#666' }
    return <span style={{ padding: '2px 8px', borderRadius: 4, background: s.cor, color: '#fff', fontSize: 12 }}>{s.texto}</span>
  }

  if (carregando) return <div>Carregando...</div>

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <h1 style={{ marginBottom: 24 }}>Usuários</h1>

      {erro && <p style={{ color: 'red', marginBottom: 12 }}>{erro}</p>}

      <div style={{ marginBottom: 16, padding: 12, background: '#f8f9fa', borderRadius: 4 }}>
        <label>Plano para confirmação: </label>
        <select
          value={planoSelecionado}
          onChange={e => setPlanoSelecionado(Number(e.target.value))}
          style={{ padding: 6, marginLeft: 8 }}
        >
          {planos.map(p => (
            <option key={p.id} value={p.id}>{p.nome} — R$ {p.valorMensal}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {usuarios.map(usuario => (
          <div key={usuario.id} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h3 style={{ marginBottom: 4 }}>{usuario.nome}</h3>
                <p style={{ color: '#666', fontSize: 14 }}>{usuario.email}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {formatarStatus(usuario.status)}
                <span style={{ fontSize: 12, color: '#666' }}>{usuario.role}</span>
              </div>
            </div>

            <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
              <span>Trial: {formatarData(usuario.dataInicioTrial)} até {formatarData(usuario.dataFimTrial)}</span>
              <span style={{ marginLeft: 16 }}>Cadastro: {formatarData(usuario.criadoEm)}</span>
            </div>

            {usuario.assinaturaAtiva && (
              <div style={{ marginTop: 8, padding: 8, background: '#e7f3ff', borderRadius: 4, fontSize: 14 }}>
                Assinatura: {usuario.assinaturaAtiva.planoNome} — {usuario.assinaturaAtiva.status} — Expira em {formatarData(usuario.assinaturaAtiva.dataExpiracao)}
              </div>
            )}

            {(usuario.status === 'TRIAL_EXPIRADO' || usuario.status === 'BLOQUEADO') && (
              <div style={{ marginTop: 8 }}>
                {confirmando === usuario.id ? (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span>Confirmar pagamento?</span>
                    <button
                      onClick={() => handleConfirmarPagamento(usuario.id)}
                      style={{ padding: '4px 12px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 4 }}
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setConfirmando(null)}
                      style={{ padding: '4px 12px', background: '#6c757d', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 4 }}
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmando(usuario.id)}
                    style={{ padding: '6px 12px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 4 }}
                  >
                    Confirmar Pagamento
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
