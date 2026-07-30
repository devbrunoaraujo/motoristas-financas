import { useState, useEffect } from 'react'
import * as adminService from '../../services/adminService'
import type { AdminDashboard } from '../../types/admin'

export default function AdminDashboard() {
  const [dados, setDados] = useState<AdminDashboard | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarDashboard()
  }, [])

  async function carregarDashboard() {
    try {
      setCarregando(true)
      const data = await adminService.getDashboard()
      setDados(data)
    } catch (err: any) {
      setErro('Erro ao carregar dashboard')
    } finally {
      setCarregando(false)
    }
  }

  if (carregando) return <div>Carregando...</div>
  if (erro) return <div style={{ color: 'red' }}>{erro}</div>
  if (!dados) return null

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1 style={{ marginBottom: 24 }}>Painel Admin</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <Card titulo="Total de Usuários" valor={dados.totalUsuarios} cor="#007bff" />
        <Card titulo="Trial Ativo" valor={dados.usuariosTrialAtivo} cor="#28a745" />
        <Card titulo="Ativos" valor={dados.usuariosAtivos} cor="#17a2b8" />
        <Card titulo="Trial Expirado" valor={dados.usuariosTrialExpirado} cor="#ffc107" />
        <Card titulo="Bloqueados" valor={dados.usuariosBloqueados} cor="#dc3545" />
      </div>
    </div>
  )
}

function Card({ titulo, valor, cor }: { titulo: string; valor: number; cor: string }) {
  return (
    <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, borderTop: `4px solid ${cor}` }}>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>{titulo}</p>
      <p style={{ fontSize: 28, fontWeight: 'bold', color: cor }}>{valor}</p>
    </div>
  )
}
