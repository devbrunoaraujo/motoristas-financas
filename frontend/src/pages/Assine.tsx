import { useAuth } from '../contexts/AuthContext'

export default function Assine() {
  const { usuario, logout } = useAuth()

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🔒</div>

      <h1 style={{ marginBottom: 16, color: '#dc3545' }}>Acesso Bloqueado</h1>

      <p style={{ fontSize: 18, marginBottom: 24, color: '#666' }}>
        {usuario?.nome}, seu período gratuito expirou.
      </p>

      <div style={{ padding: 24, background: '#f8f9fa', borderRadius: 8, marginBottom: 24 }}>
        <h2 style={{ marginBottom: 12 }}>Assine um Plano</h2>
        <p style={{ marginBottom: 16, color: '#666' }}>
          Para continuar usando o Motoristas Finanças, escolha um de nossos planos:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <div style={{ padding: 16, background: '#fff', borderRadius: 8, border: '2px solid #007bff' }}>
            <h3>Básico</h3>
            <p style={{ fontSize: 24, fontWeight: 'bold', color: '#007bff' }}>R$ 19,90</p>
            <p style={{ fontSize: 12, color: '#666' }}>1 veículo</p>
          </div>

          <div style={{ padding: 16, background: '#fff', borderRadius: 8, border: '2px solid #28a745' }}>
            <h3>Pro</h3>
            <p style={{ fontSize: 24, fontWeight: 'bold', color: '#28a745' }}>R$ 39,90</p>
            <p style={{ fontSize: 12, color: '#666' }}>3 veículos</p>
          </div>

          <div style={{ padding: 16, background: '#fff', borderRadius: 8, border: '2px solid #6f42c1' }}>
            <h3>Premium</h3>
            <p style={{ fontSize: 24, fontWeight: 'bold', color: '#6f42c1' }}>R$ 69,90</p>
            <p style={{ fontSize: 12, color: '#666' }}>Ilimitado</p>
          </div>
        </div>
      </div>

      <p style={{ marginBottom: 24, color: '#666' }}>
        Entre em contato para realizar o pagamento:
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
        <a
          href="https://wa.me/5500000000000"
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: '12px 24px', background: '#25D366', color: '#fff', textDecoration: 'none', borderRadius: 8 }}
        >
          WhatsApp
        </a>
        <a
          href="mailto:contato@motoristasfinancas.com"
          style={{ padding: '12px 24px', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: 8 }}
        >
          Email
        </a>
      </div>

      <button
        onClick={logout}
        style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 4 }}
      >
        Sair da conta
      </button>
    </div>
  )
}
