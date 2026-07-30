import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button, Input } from '../components/ui'
import { ArrowRight } from 'lucide-react'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const { cadastro, usuario } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      await cadastro({ nome, email, senha })
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || 'Erro ao criar conta')
    } finally {
      setCarregando(false)
    }
  }

  if (usuario) {
    if (usuario.role === 'ADMIN') return <Navigate to="/admin" replace />
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 'var(--space-lg)',
    }}>
      <div style={{ maxWidth: 400, width: '100%', margin: '0 auto', animation: 'slideUp 0.5s ease forwards' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-md)', fontSize: 24, fontWeight: 800,
            boxShadow: 'var(--shadow-glow)',
          }}>MF</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Crie sua conta</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Comece a controlar suas finanças</p>
        </div>

        <form onSubmit={handleSubmit}>
          {erro && (
            <div style={{
              padding: '12px 14px', background: 'rgba(225, 112, 85, 0.1)',
              border: '1px solid rgba(225, 112, 85, 0.2)', borderRadius: 'var(--radius-md)',
              color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)',
            }}>{erro}</div>
          )}

          <Input label="Nome" type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" required />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required />
          <Input label="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Mínimo 6 caracteres" required />

          <Button type="submit" fullWidth size="lg" disabled={carregando} style={{ marginTop: 'var(--space-sm)' }}>
            {carregando ? 'Criando conta...' : <>Criar conta <ArrowRight size={18} /></>}
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-lg)', color: 'var(--text-muted)', fontSize: 14 }}>
          Já tem conta?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Entrar</Link>
        </p>
      </div>
    </div>
  )
}
