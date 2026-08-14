import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Login from '../screens/Login'
import Cadastro from '../screens/Cadastro'
import Dashboard from '../screens/Dashboard'
import RegistroDia from '../screens/RegistroDia'
import Veiculos from '../screens/Veiculos'
import Combustivel from '../screens/Combustivel'
import Despesas from '../screens/Despesas'
import Metas from '../screens/Metas'
import Financeiro from '../screens/Financeiro'
import Manutencao from '../screens/Manutencao'
import { colors } from '../components/ui'
import { LayoutDashboard, Calendar, Car, Receipt, Target, Wrench, DollarSign, LogOut } from 'lucide-react'

function NavBar() {
  const { isAuthenticated, usuario, logout } = useAuth()
  if (!isAuthenticated) return null

  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/registros', icon: Calendar, label: 'Registros' },
    { to: '/metas', icon: Target, label: 'Metas' },
    { to: '/financeiro', icon: DollarSign, label: 'Financeiro' },
    { to: '/veiculos', icon: Car, label: 'Veículos' },
    { to: '/manutencao', icon: Wrench, label: 'Manutenção' },
    { to: '/despesas', icon: Receipt, label: 'Despesas' },
  ]

  return (
    <>
      {/* Header with logout */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 56,
        background: colors.bg,
        borderBottom: `1px solid ${colors.border}`, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentLight})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: 14, color: '#fff',
          }}>MF</div>
          <span style={{ fontWeight: 600, fontSize: 16, color: colors.text }}>Motoristas Finanças</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: colors.textSecondary }}>{usuario?.nome}</span>
          <button onClick={logout} style={{
            background: 'none', border: 'none', color: colors.textMuted,
            cursor: 'pointer', padding: 6, borderRadius: 8,
            display: 'flex', alignItems: 'center',
          }}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Bottom navigation */}
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
            <link.icon size={20} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
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
      <main style={{ paddingTop: 72, paddingBottom: 80, minHeight: '100vh', background: colors.bg }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/registros" element={isAuthenticated ? <RegistroDia /> : <Navigate to="/login" replace />} />
          <Route path="/veiculos" element={isAuthenticated ? <Veiculos /> : <Navigate to="/login" replace />} />
          <Route path="/combustivel" element={isAuthenticated ? <Combustivel /> : <Navigate to="/login" replace />} />
          <Route path="/despesas" element={isAuthenticated ? <Despesas /> : <Navigate to="/login" replace />} />
          <Route path="/metas" element={isAuthenticated ? <Metas /> : <Navigate to="/login" replace />} />
          <Route path="/financeiro" element={isAuthenticated ? <Financeiro /> : <Navigate to="/login" replace />} />
          <Route path="/manutencao" element={isAuthenticated ? <Manutencao /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
