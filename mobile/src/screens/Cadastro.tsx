import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button, Input, colors } from '../components/ui'

export default function Cadastro() {
  const { cadastro, usuario } = useAuth()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleCadastro() {
    setErro(''); setCarregando(true)
    try { await cadastro(nome, email, senha) }
    catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao criar conta') }
    finally { setCarregando(false) }
  }

  if (usuario) {
    navigate('/', { replace: true })
    return null
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24, background: colors.bg }}>
      <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, fontWeight: 800, color: '#fff' }}>MF</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.text, marginBottom: 4 }}>Crie sua conta</h1>
          <p style={{ fontSize: 15, color: colors.textMuted }}>Comece a controlar suas finanças</p>
        </div>

        {erro && <div style={{ padding: 12, background: 'rgba(225,112,85,0.1)', borderRadius: 12, marginBottom: 16, color: colors.danger, fontSize: 14 }}>{erro}</div>}

        <Input label="Nome" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" />
        <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" type="email" />
        <Input label="Senha" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Mínimo 6 caracteres" type="password" />
        <Button onClick={handleCadastro} disabled={carregando}>{carregando ? 'Criando conta...' : 'Criar conta'}</Button>

        <p style={{ textAlign: 'center', marginTop: 24, color: colors.textMuted, fontSize: 14 }}>
          Já tem conta? <Link to="/login" style={{ color: colors.accent, textDecoration: 'none', fontWeight: 600 }}>Entrar</Link>
        </p>
      </div>
    </div>
  )
}
