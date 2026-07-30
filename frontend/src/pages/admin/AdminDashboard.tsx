import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import * as adminService from '../../services/adminService'
import type { AdminDashboard } from '../../types/admin'
import { Card, StatCard, PageHeader } from '../../components/ui'
import { Users, UserCheck, UserX, Clock } from 'lucide-react'

const COLORS = ['#00b894', '#74b9ff', '#fdcb6e', '#e17055']

export default function AdminDashboard() {
  const [dados, setDados] = useState<AdminDashboard | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => { carregarDashboard() }, [])

  async function carregarDashboard() {
    try { setCarregando(true); setDados(await adminService.getDashboard()) }
    catch {} finally { setCarregando(false) }
  }

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  if (!dados) return null

  const pieData = [
    { name: 'Trial Ativo', value: dados.usuariosTrialAtivo },
    { name: 'Ativos', value: dados.usuariosAtivos },
    { name: 'Trial Expirado', value: dados.usuariosTrialExpirado },
    { name: 'Bloqueados', value: dados.usuariosBloqueados },
  ].filter(d => d.value > 0)

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 600, margin: '0 auto' }}>
      <PageHeader title="Painel Admin" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <StatCard title="Total" value={String(dados.totalUsuarios)} icon={<Users size={20} />} color="var(--info)" />
        <StatCard title="Trial Ativo" value={String(dados.usuariosTrialAtivo)} icon={<Clock size={20} />} color="var(--accent)" />
        <StatCard title="Ativos" value={String(dados.usuariosAtivos)} icon={<UserCheck size={20} />} color="var(--accent-light)" />
        <StatCard title="Bloqueados" value={String(dados.usuariosBloqueados)} icon={<UserX size={20} />} color="var(--danger)" />
      </div>

      {pieData.length > 0 && (
        <Card>
          <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>Distribuição de Usuários</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {pieData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 'auto' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
