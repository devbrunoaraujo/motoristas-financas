import { useState, useEffect } from 'react'
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import * as dashboardService from '../../services/dashboardService'
import type { DashboardResponse } from '../../types/dashboard'
import { Card, StatCard, PageHeader } from '../../components/ui'
import { TrendingUp, Fuel, Receipt, DollarSign, Gauge, BarChart3 } from 'lucide-react'

const COLORS = ['#00b894', '#e17055', '#fdcb6e', '#74b9ff', '#a29bfe']

export default function Dashboard() {
  const [dados, setDados] = useState<DashboardResponse | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => { carregarDashboard() }, [])

  async function carregarDashboard() {
    try {
      setCarregando(true)
      const data = await dashboardService.getDashboard()
      setDados(data)
    } catch (err: any) {
      setErro('Erro ao carregar dashboard')
    } finally {
      setCarregando(false)
    }
  }

  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  if (erro || !dados) return <div style={{ padding: 'var(--space-lg)', color: 'var(--danger)', textAlign: 'center' }}>{erro}</div>

  const areaData = [
    { name: 'Ganho', value: dados.ganhoBrutoDia },
    { name: 'Combustível', value: dados.gastoCombustivelDia },
    { name: 'Lucro', value: dados.lucroLiquidoDia },
  ]

  const pieData = [
    { name: 'Combustível', value: Math.abs(dados.gastoCombustivelMes) },
    { name: 'Despesas', value: Math.abs(dados.despesasMes) },
    { name: 'Lucro', value: Math.max(0, dados.lucroLiquidoMes) },
  ].filter(d => d.value > 0)

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 600, margin: '0 auto' }}>
      <PageHeader title="Dashboard" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <StatCard title="Ganho Hoje" value={formatarMoeda(dados.ganhoBrutoDia)} icon={<TrendingUp size={20} />} color="var(--accent)" />
        <StatCard title="Ganho Mês" value={formatarMoeda(dados.ganhoBrutoMes)} icon={<BarChart3 size={20} />} color="var(--accent-light)" />
        <StatCard title="Combustível Mês" value={formatarMoeda(dados.gastoCombustivelMes)} icon={<Fuel size={20} />} color="var(--danger)" />
        <StatCard title="Despesas Mês" value={formatarMoeda(dados.despesasMes)} icon={<Receipt size={20} />} color="var(--warning)" />
        <StatCard title="Lucro Mês" value={formatarMoeda(dados.lucroLiquidoMes)} icon={<DollarSign size={20} />} color={dados.lucroLiquidoMes >= 0 ? 'var(--accent)' : 'var(--danger)'} />
        <StatCard title="KM Rodado" value={`${dados.kmTotalRodado.toFixed(1)} km`} icon={<Gauge size={20} />} color="var(--info)" />
      </div>

      {/* Area Chart */}
      <Card style={{ marginBottom: 'var(--space-md)' }}>
        <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>Resumo do Dia</h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={areaData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00b894" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00b894" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fill: '#a0a0c0', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
              formatter={(value) => [formatarMoeda(Number(value)), '']}
            />
            <Area type="monotone" dataKey="value" stroke="#00b894" fill="url(#colorValue)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Pie Chart */}
      {pieData.length > 0 && (
        <Card>
          <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>Distribuição de Gastos (Mês)</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
                  formatter={(value) => [formatarMoeda(Number(value)), '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {pieData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 'auto' }}>{formatarMoeda(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
