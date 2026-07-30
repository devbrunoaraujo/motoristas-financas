import { useAuth } from '../contexts/AuthContext'
import { Button, Card } from '../components/ui'
import { Lock, MessageCircle, Mail, LogOut } from 'lucide-react'

export default function Assine() {
  const { usuario, logout } = useAuth()

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

        <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
          <Button variant="primary" fullWidth>
            <MessageCircle size={18} /> WhatsApp
          </Button>
          <Button variant="secondary" fullWidth>
            <Mail size={18} /> Email
          </Button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button variant="ghost" onClick={logout}>
            <LogOut size={16} /> Sair da conta
          </Button>
        </div>
      </div>
    </div>
  )
}
