import { useState, useEffect } from 'react'
import * as dashboardService from '../../services/dashboardService'
import type { DashboardResponse } from '../../types/dashboard'

export default function Dashboard() {
  const [dados, setDados] = useState<DashboardResponse | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarDashboard()
  }, [])

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

  if (carregando) return <div>Carregando...</div>
  if (erro) return <div style={{ color: 'red' }}>{erro}</div>
  if (!dados) return null

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <Card titulo="Ganho Bruto (Dia)" valor={formatarMoeda(dados.ganhoBrutoDia)} cor="#28a745" />
        <Card titulo="Ganho Bruto (Semana)" valor={formatarMoeda(dados.ganhoBrutoSemana)} cor="#28a745" />
        <Card titulo="Ganho Bruto (Mês)" valor={formatarMoeda(dados.ganhoBrutoMes)} cor="#28a745" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <Card titulo="Gasto Combustível (Dia)" valor={formatarMoeda(dados.gastoCombustivelDia)} cor="#dc3545" />
        <Card titulo="Gasto Combustível (Semana)" valor={formatarMoeda(dados.gastoCombustivelSemana)} cor="#dc3545" />
        <Card titulo="Gasto Combustível (Mês)" valor={formatarMoeda(dados.gastoCombustivelMes)} cor="#dc3545" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <Card titulo="Despesas (Mês)" valor={formatarMoeda(dados.despesasMes)} cor="#ffc107" />
        <Card titulo="Lucro Líquido (Dia)" valor={formatarMoeda(dados.lucroLiquidoDia)} cor={dados.lucroLiquidoDia >= 0 ? '#28a745' : '#dc3545'} />
        <Card titulo="Lucro Líquido (Semana)" valor={formatarMoeda(dados.lucroLiquidoSemana)} cor={dados.lucroLiquidoSemana >= 0 ? '#28a745' : '#dc3545'} />
        <Card titulo="Lucro Líquido (Mês)" valor={formatarMoeda(dados.lucroLiquidoMes)} cor={dados.lucroLiquidoMes >= 0 ? '#28a745' : '#dc3545'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <Card titulo="KM Total Rodado (Mês)" valor={`${dados.kmTotalRodado.toFixed(1)} km`} cor="#17a2b8" />
        <Card titulo="Ganho Médio por KM" valor={formatarMoeda(dados.ganhoMedioPorKm)} cor="#6f42c1" />
      </div>
    </div>
  )
}

function Card({ titulo, valor, cor }: { titulo: string; valor: string; cor: string }) {
  return (
    <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, borderTop: `4px solid ${cor}` }}>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>{titulo}</p>
      <p style={{ fontSize: 20, fontWeight: 'bold', color: cor }}>{valor}</p>
    </div>
  )
}
