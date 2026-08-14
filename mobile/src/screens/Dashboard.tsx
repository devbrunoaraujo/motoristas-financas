import { useState, useEffect } from 'react'
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import * as dashboardService from '../services/dashboardService'
import * as metaService from '../services/metaService'
import * as exportacaoService from '../services/exportacaoService'
import type { DashboardResponse, MetaProgresso } from '../types'
import type { DiaResumo } from '../services/dashboardService'
import { Card, StatCard, PageHeader, Button, Loading, ProgressBar, colors } from '../components/ui'
import TrialCard from '../components/TrialCard'
import { TrendingUp, Fuel, Receipt, DollarSign, Gauge, BarChart3, Target, Download, FileSpreadsheet } from 'lucide-react'

const COLORS = ['#00b894', '#e17055', '#fdcb6e', '#74b9ff', '#a29bfe']

export default function Dashboard() {
  const [dados, setDados] = useState<DashboardResponse | null>(null)
  const [ultimosDias, setUltimosDias] = useState<DiaResumo[]>([])
  const [progresso, setProgresso] = useState<MetaProgresso | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => { carregarDashboard() }, [])

  async function carregarDashboard() {
    try {
      setCarregando(true)
      const [data, dias, prog] = await Promise.all([
        dashboardService.getDashboard(),
        dashboardService.getUltimosDias(7),
        metaService.getProgresso()
      ])
      setDados(data)
      setUltimosDias(dias)
      setProgresso(prog)
    } catch {
      setErro('Erro ao carregar dashboard')
    } finally {
      setCarregando(false)
    }
  }

  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  function formatarDataCurta(data: string) {
    const d = new Date(data + 'T00:00:00')
    return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' })
  }

  if (carregando) return <Loading />

  if (erro || !dados) return (
    <div style={{ padding: 16, color: colors.danger, textAlign: 'center' }}>{erro}</div>
  )

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

  const barData = ultimosDias.map(dia => ({
    name: formatarDataCurta(dia.data),
    ganho: Number(dia.percentualGanho),
    combustivel: Number(dia.percentualCombustivel),
    ganhoValor: dia.ganhoBruto,
    combustivelValor: dia.gastoCombustivel,
    lucro: dia.lucroLiquido,
  }))

  return (
    <div style={{ padding: 16 }}>
      <PageHeader title="Dashboard" />

      {/* Export buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Button variant="ghost" onClick={() => exportacaoService.exportarRelatorio('xlsx')} style={{ width: 'auto', padding: '8px 16px' }}>
          <FileSpreadsheet size={14} /> Excel
        </Button>
        <Button variant="ghost" onClick={() => exportacaoService.exportarRelatorio('pdf')} style={{ width: 'auto', padding: '8px 16px' }}>
          <Download size={14} /> PDF
        </Button>
      </div>

      <TrialCard />

      {/* Meta Progress */}
      {progresso && (
        <Card style={{ marginBottom: 16, background: 'linear-gradient(135deg, rgba(0,184,148,0.05), rgba(162,155,254,0.05))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Target size={18} color={colors.accent} />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>Metas de Lucro</h3>
          </div>
          <ProgressBar label="Diária" realizado={progresso.realizadoDiaria} meta={progresso.metaDiaria} percentual={progresso.percentualDiaria} cor={colors.info} />
          <ProgressBar label="Semanal" realizado={progresso.realizadoSemanal} meta={progresso.metaSemanal} percentual={progresso.percentualSemanal} cor={colors.accent} />
          <ProgressBar label="Mensal" realizado={progresso.realizadoMensal} meta={progresso.metaMensal} percentual={progresso.percentualMensal} cor="#a29bfe" />
        </Card>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
        <StatCard title="Ganho Hoje" value={formatarMoeda(dados.ganhoBrutoDia)} icon={<TrendingUp size={20} />} color={colors.accent} />
        <StatCard title="Ganho Mês" value={formatarMoeda(dados.ganhoBrutoMes)} icon={<BarChart3 size={20} />} color={colors.accentLight} />
        <StatCard title="Combustível Mês" value={formatarMoeda(dados.gastoCombustivelMes)} icon={<Fuel size={20} />} color={colors.danger} />
        <StatCard title="Despesas Mês" value={formatarMoeda(dados.despesasMes)} icon={<Receipt size={20} />} color={colors.warning} />
        <StatCard title="Lucro Mês" value={formatarMoeda(dados.lucroLiquidoMes)} icon={<DollarSign size={20} />} color={dados.lucroLiquidoMes >= 0 ? colors.accent : colors.danger} />
        <StatCard title="KM Rodado" value={`${dados.kmTotalRodado.toFixed(1)} km`} icon={<Gauge size={20} />} color={colors.info} />
      </div>

      {/* Performance por KM */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
        <Card style={{ background: 'linear-gradient(135deg, rgba(0,184,148,0.08), rgba(0,184,148,0.03))' }}>
          <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Ganho Bruto/KM</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: colors.accent }}>{formatarMoeda(dados.ganhoBrutoPorKm)}</p>
          <p style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>Média mensal por km rodado</p>
        </Card>
        <Card style={{ background: 'linear-gradient(135deg, rgba(225,112,85,0.08), rgba(225,112,85,0.03))' }}>
          <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Custo Combustível/KM</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: colors.danger }}>{formatarMoeda(dados.custoCombustivelPorKm)}</p>
          <p style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>Quanto gasta em combustível por km</p>
        </Card>
      </div>

      {/* Stacked Bar Chart */}
      {barData.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 4 }}>Últimos 7 Dias</h3>
          <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 16 }}>Ganho bruto vs gasto combustível (%)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={28}>
              <XAxis dataKey="name" tick={{ fill: '#a0a0c0', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#a0a0c0', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text, fontSize: 13 }}
                formatter={(value, name) => {
                  const entry = barData.find(b => b.ganho === value || b.combustivel === value)
                  if (name === 'Ganho Bruto') return [`${value}% (${formatarMoeda(entry?.ganhoValor || 0)})`, name]
                  return [`${value}% (${formatarMoeda(entry?.combustivelValor || 0)})`, name]
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: colors.textSecondary }} iconType="circle" iconSize={8} />
              <Bar dataKey="ganho" name="Ganho Bruto" stackId="a" fill="#00b894" />
              <Bar dataKey="combustivel" name="Combustível" stackId="a" fill="#e17055" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Area Chart */}
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>Resumo do Dia</h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={areaData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00b894" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00b894" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fill: '#a0a0c0', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} formatter={(value) => [formatarMoeda(Number(value)), '']} />
            <Area type="monotone" dataKey="value" stroke="#00b894" fill="url(#colorValue)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Pie Chart */}
      {pieData.length > 0 && (
        <Card>
          <h3 style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>Distribuição de Gastos (Mês)</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12 }} formatter={(value) => [formatarMoeda(Number(value)), '']} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {pieData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                  <span style={{ fontSize: 13, color: colors.textSecondary }}>{item.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 'auto', color: colors.text }}>{formatarMoeda(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
