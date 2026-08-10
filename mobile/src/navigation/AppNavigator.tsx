import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Login from '../screens/Login'
import Cadastro from '../screens/Cadastro'
import Dashboard from '../screens/Dashboard'
import RegistroDia from '../screens/RegistroDia'
import Veiculos from '../screens/Veiculos'
import Combustivel from '../screens/Combustivel'
import Despesas from '../screens/Despesas'
import { colors } from '../components/ui'

function NavBar() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return null

  const links = [
    { to: '/', icon: '📊', label: 'Dashboard' },
    { to: '/registros', icon: '📅', label: 'Registros' },
    { to: '/veiculos', icon: '🚗', label: 'Veículos' },
    { to: '/combustivel', icon: '⛽', label: 'Combustível' },
    { to: '/despesas', icon: '📋', label: 'Despesas' },
  ]

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: 64,
      background: colors.bg, borderTop: `1px solid ${colors.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      zIndex: 100,
    }}>
      {links.map(link => (
        <NavLink key={link.to} to={link.to} end={link.to === '/'}
          style={({ isActive }) => ({
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            textDecoration: 'none', color: isActive ? colors.accent : colors.textMuted,
            fontSize: 10, fontWeight: isActive ? 600 : 400, padding: '6px 8px',
            borderRadius: 8, transition: 'color 0.2s', minWidth: 56,
          })}>
          <span style={{ fontSize: 20 }}>{link.icon}</span>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

function HomeRedirect() {
  const { isAuthenticated, isLoading, usuario } = useAuth()
  if (isLoading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (usuario?.role === 'ADMIN') return <Navigate to="/admin" replace />
  return <Navigate to="/" replace />
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null

  return (
    <BrowserRouter>
      <NavBar />
      <main style={{ paddingTop: 16, paddingBottom: 80, minHeight: '100vh', background: colors.bg }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/registros" element={isAuthenticated ? <RegistroDia /> : <Navigate to="/login" replace />} />
          <Route path="/veiculos" element={isAuthenticated ? <Veiculos /> : <Navigate to="/login" replace />} />
          <Route path="/combustivel" element={isAuthenticated ? <Combustivel /> : <Navigate to="/login" replace />} />
          <Route path="/despesas" element={isAuthenticated ? <Despesas /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
