import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const { cadastro } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      await cadastro({ nome, email, senha })
      navigate('/')
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || 'Erro ao criar conta')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h1>Criar Conta</h1>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          style={{ width: '100%', padding: 12, background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          {carregando ? 'Criando...' : 'Criar conta'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 16 }}>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  )
}
