import { useState, useEffect } from 'react'
import { api } from '../api/api'
import { useAuth } from '../contexts/AuthContext'
import { Card, Loading, colors } from '../components/ui'
import type { DashboardResponse } from '../types'

export default function Dashboard() {
  const { usuario } = useAuth()
  const [dados, setDados] = useState<DashboardResponse | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => { carregarDados() }, [])

  async function carregarDados() {
    try { const r = await api.get<DashboardResponse>('/dashboard'); setDados(r.data) }
    catch {} finally { setCarregando(false) }
  }

  function fmtMoeda(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }

  if (carregando) return <Loading />

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.text, marginBottom: 4 }}>Olá, {usuario?.nome}</h1>
      <p style={{ fontSize: 14, color: colors.textMuted, marginBottom: 24 }}>Seu resumo financeiro</p>

      {dados && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <Card><p style={{ fontSize: 12, color: colors.textMuted }}>Ganho Hoje</p><p style={{ fontSize: 20, fontWeight: 700, color: colors.accent, marginTop: 4 }}>{fmtMoeda(dados.ganhoBrutoDia)}</p></Card>
            <Card><p style={{ fontSize: 12, color: colors.textMuted }}>Lucro Mês</p><p style={{ fontSize: 20, fontWeight: 700, color: dados.lucroLiquidoMes >= 0 ? colors.accent : colors.danger, marginTop: 4 }}>{fmtMoeda(dados.lucroLiquidoMes)}</p></Card>
            <Card><p style={{ fontSize: 12, color: colors.textMuted }}>Combustível Mês</p><p style={{ fontSize: 18, fontWeight: 600, color: colors.danger, marginTop: 4 }}>{fmtMoeda(dados.gastoCombustivelMes)}</p></Card>
            <Card><p style={{ fontSize: 12, color: colors.textMuted }}>KM Rodado</p><p style={{ fontSize: 18, fontWeight: 600, color: colors.info, marginTop: 4 }}>{dados.kmTotalRodado.toFixed(1)} km</p></Card>
          </div>

          <Card style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: colors.textSecondary, marginBottom: 12 }}>Performance por KM</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div><p style={{ fontSize: 12, color: colors.textMuted }}>Ganho Bruto/KM</p><p style={{ fontSize: 18, fontWeight: 700, color: colors.accent }}>{fmtMoeda(dados.ganhoBrutoPorKm)}</p></div>
              <div style={{ textAlign: 'right' }}><p style={{ fontSize: 12, color: colors.textMuted }}>Custo Combustível/KM</p><p style={{ fontSize: 18, fontWeight: 700, color: colors.danger }}>{fmtMoeda(dados.custoCombustivelPorKm)}</p></div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
