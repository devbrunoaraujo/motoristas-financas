import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import * as authService from '../services/authService'
import type { TrialInfo } from '../types/admin'
import { Card } from './ui'
import { Clock, MessageCircle, AlertTriangle } from 'lucide-react'

export default function TrialCard() {
  const { usuario } = useAuth()
  const [trialInfo, setTrialInfo] = useState<TrialInfo | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // Só buscar info de trial se o usuário estiver em trial ou trial expirado
    if (usuario?.role === 'MOTORISTA' && 
        (usuario.status === 'TRIAL_ATIVO' || usuario.status === 'TRIAL_EXPIRADO')) {
      carregarTrialInfo()
    } else {
      setCarregando(false)
    }
  }, [usuario])

  async function carregarTrialInfo() {
    try {
      setCarregando(true)
      const info = await authService.getTrialInfo()
      setTrialInfo(info)
    } catch {
      // Silently fail
    } finally {
      setCarregando(false)
    }
  }

  // Não mostrar nada se não for motorista ou se já tem plano ativo
  if (carregando || !trialInfo || usuario?.role !== 'MOTORISTA') return null
  if (usuario.status !== 'TRIAL_ATIVO' && usuario.status !== 'TRIAL_EXPIRADO') return null

  const { diasRestantes, expirado, whatsappAdmin } = trialInfo
  const porcentagem = Math.max(0, Math.min(100, (diasRestantes / 7) * 100))

  function abrirWhatsApp() {
    const mensagem = encodeURIComponent('Olá! Quero assinar um plano do KmUp.')
    const url = whatsappAdmin
      ? `https://wa.me/${whatsappAdmin}?text=${mensagem}`
      : `https://wa.me/?text=${mensagem}`
    window.open(url, '_blank')
  }

  if (expirado) {
    return (
      <Card style={{
        marginBottom: 'var(--space-md)',
        background: 'linear-gradient(135deg, rgba(225,112,85,0.1), rgba(225,112,85,0.05))',
        border: '1px solid rgba(225,112,85,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <AlertTriangle size={20} color="var(--danger)" />
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--danger)' }}>Trial Expirado</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Seu período gratuito terminou</p>
          </div>
        </div>
        <button
          onClick={abrirWhatsApp}
          style={{
            width: '100%',
            padding: '12px',
            background: '#25D366',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <MessageCircle size={18} /> Falar com Administrador
        </button>
      </Card>
    )
  }

  return (
    <Card style={{
      marginBottom: 'var(--space-md)',
      background: 'linear-gradient(135deg, rgba(0,184,148,0.08), rgba(116,185,255,0.05))',
      border: '1px solid rgba(0,184,148,0.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Clock size={20} color="var(--accent)" />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 600 }}>Período de Trial</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {diasRestantes} {diasRestantes === 1 ? 'dia restante' : 'dias restantes'}
          </p>
        </div>
        <span style={{
          fontSize: 22,
          fontWeight: 700,
          color: diasRestantes <= 2 ? 'var(--danger)' : 'var(--accent)',
        }}>
          {diasRestantes}d
        </span>
      </div>

      <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: 12 }}>
        <div style={{
          height: '100%',
          width: `${porcentagem}%`,
          background: diasRestantes <= 2
            ? 'linear-gradient(90deg, var(--danger), var(--danger-light))'
            : 'linear-gradient(90deg, var(--accent), var(--accent-light))',
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.8s ease',
        }} />
      </div>

      {whatsappAdmin && (
        <button
          onClick={abrirWhatsApp}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(37,211,102,0.1)',
            color: '#25D366',
            border: '1px solid rgba(37,211,102,0.2)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <MessageCircle size={16} /> Assinar agora via WhatsApp
        </button>
      )}
    </Card>
  )
}
