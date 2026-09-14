import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Assine from './pages/Assine'
import Veiculos from './pages/motorista/Veiculos'
import Combustivel from './pages/motorista/Combustivel'
import RegistroDia from './pages/motorista/RegistroDia'
import Despesas from './pages/motorista/Despesas'
import Dashboard from './pages/motorista/Dashboard'
import Metas from './pages/motorista/Metas'
import Manutencao from './pages/motorista/Manutencao'
import Financeiro from './pages/motorista/Financeiro'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import AdminPlanos from './pages/admin/AdminPlanos'
import AdminPlataformas from './pages/admin/AdminPlataformas'
import Configuracoes from './pages/admin/Configuracoes'
import { LayoutDashboard, Calendar, Car, Receipt, Target, Wrench, DollarSign, Users, CreditCard, Layers, Settings, LogOut } from 'lucide-react'

function NavBar() {
  const { isAuthenticated, usuario, logout } = useAuth()

  if (!isAuthenticated) return null

  const isAdmin = usuario?.role === 'ADMIN'

  const motoristaLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/registros', icon: Calendar, label: 'Registros' },
    { to: '/metas', icon: Target, label: 'Metas' },
    { to: '/financeiro', icon: DollarSign, label: 'Financeiro' },
    { to: '/veiculos', icon: Car, label: 'Veículos' },
    { to: '/manutencao', icon: Wrench, label: 'Manutenção' },
    { to: '/despesas', icon: Receipt, label: 'Despesas' },
  ]

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/usuarios', icon: Users, label: 'Usuários' },
    { to: '/admin/planos', icon: CreditCard, label: 'Planos' },
    { to: '/admin/plataformas', icon: Layers, label: 'Plataformas' },
    { to: '/admin/configuracoes', icon: Settings, label: 'Config' },
  ]

  const links = isAdmin ? adminLinks : motoristaLinks

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 56,
        background: 'var(--bg-nav)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '0 var(--space-md)', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/logo.svg" alt="KmUp" style={{ width: 32, height: 32 }} />
          <span style={{ fontWeight: 600, fontSize: 16 }}>KmUp</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{usuario?.nome}</span>
          <button onClick={logout} style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', padding: 6, borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center',
          }}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: 64,
        background: 'var(--bg-nav)', backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--border)', display: 'flex',
        alignItems: 'center', justifyContent: 'space-around',
        zIndex: 100, padding: '0 var(--space-xs)',
      }}>
        {links.map(link => (
          <NavLink key={link.to} to={link.to}
            end={link.to === '/admin' || link.to === '/dashboard'}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              textDecoration: 'none', color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: 10, fontWeight: isActive ? 600 : 400, padding: '6px 8px',
              borderRadius: 'var(--radius-sm)', transition: 'color var(--transition-fast)', minWidth: 56,
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
  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (usuario?.role === 'ADMIN') return <Navigate to="/admin" replace />
  return <Navigate to="/dashboard" replace />
}

function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <main style={{ paddingTop: 56, paddingBottom: 72, minHeight: '100vh' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/assine" element={<Assine />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/registros" element={<PrivateRoute><RegistroDia /></PrivateRoute>} />
            <Route path="/metas" element={<PrivateRoute><Metas /></PrivateRoute>} />
            <Route path="/financeiro" element={<PrivateRoute><Financeiro /></PrivateRoute>} />
            <Route path="/veiculos" element={<PrivateRoute><Veiculos /></PrivateRoute>} />
            <Route path="/manutencao" element={<PrivateRoute><Manutencao /></PrivateRoute>} />
            <Route path="/combustivel" element={<PrivateRoute><Combustivel /></PrivateRoute>} />
            <Route path="/despesas" element={<PrivateRoute><Despesas /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/usuarios" element={<PrivateRoute><AdminUsuarios /></PrivateRoute>} />
            <Route path="/admin/planos" element={<PrivateRoute><AdminPlanos /></PrivateRoute>} />
            <Route path="/admin/plataformas" element={<PrivateRoute><AdminPlataformas /></PrivateRoute>} />
            <Route path="/admin/configuracoes" element={<PrivateRoute><Configuracoes /></PrivateRoute>} />
            <Route path="/" element={<HomeRedirect />} />
            <Route path="*" element={<HomeRedirect />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
