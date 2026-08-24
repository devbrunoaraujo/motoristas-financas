import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button, Card } from '../components/ui'
import { Lock, MessageCircle, LogOut } from 'lucide-react'

export default function Assine() {
  const { usuario, logout } = useAuth()
  const [whatsappAdmin, setWhatsappAdmin] = useState('')

  useEffect(() => {
    fetchWhatsApp()
  }, [])

  async function fetchWhatsApp() {
    try {
      const response = await fetch('http://localhost:8080/configuracoes/chave/whatsapp_admin')
      if (response.ok) {
        const text = await response.text()
        setWhatsappAdmin(text)
      }
    } catch {
      // Silently fail
    }
  }

  function abrirWhatsApp() {
    const mensagem = encodeURIComponent('Olá! Quero assinar um plano do KmUp.')
    const url = whatsappAdmin
      ? `https://wa.me/${whatsappAdmin}?text=${mensagem}`
      : `https://wa.me/?text=${mensagem}`
    window.open(url, '_blank')
  }

  const planos = [
    { nome: 'Básico', valor: 'R$ 19,90', veiculos: '1 veículo', cor: 'var(--info)' },
    { nome: 'Pro', valor: 'R$ 39,90', veiculos: '3 veículos', cor: 'var(--accent)' },
    { nome: 'Premium', valor: 'R$ 69,90', veiculos: 'Ilimitado', cor: 'var(--purple)' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'var(--space-lg)' }}>
      <div style={{ maxWidth: 500, width: '100%', margin: '0 auto', animation: 'slideUp 0.5s ease forwards' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 'var(--radius-xl)',
            background: 'rgba(225, 112, 85, 0.1)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)',
          }}>
            <Lock size={32} color="var(--danger)" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: 'var(--danger)' }}>Acesso Bloqueado</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            {usuario?.nome}, seu período gratuito expirou.
          </p>
        </div>

        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, textAlign: 'center', marginBottom: 'var(--space-md)' }}>Escolha um plano</h2>
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {planos.map((plano, i) => (
              <Card key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                animationDelay: `${i * 100}ms`,
              }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>{plano.nome}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{plano.veiculos}</p>
                </div>
                <p style={{ fontSize: 22, fontWeight: 700, color: plano.cor }}>{plano.valor}</p>
              </Card>
            ))}
          </div>
        </div>

        <button
          onClick={abrirWhatsApp}
          style={{
            width: '100%',
            padding: '14px',
            background: '#25D366',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 'var(--space-md)',
          }}
        >
          <MessageCircle size={20} /> Falar com Administrador
        </button>

        <div style={{ textAlign: 'center' }}>
          <Button variant="ghost" onClick={logout}>
            <LogOut size={16} /> Sair da conta
          </Button>
        </div>
      </div>
    </div>
  )
}
