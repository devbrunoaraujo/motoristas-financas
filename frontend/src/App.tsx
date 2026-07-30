import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
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
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import AdminPlanos from './pages/admin/AdminPlanos'

function NavBar() {
  const { isAuthenticated, usuario, logout } = useAuth()

  if (!isAuthenticated) return null

  const isAdmin = usuario?.role === 'ADMIN'

  return (
    <nav style={{ padding: '10px 20px', background: '#f8f9fa', borderBottom: '1px solid #ddd', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      {isAdmin ? (
        <>
          <Link to="/admin">Admin Dashboard</Link>
          <Link to="/admin/usuarios">Usuários</Link>
          <Link to="/admin/planos">Planos</Link>
        </>
      ) : (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/registros">Registro do Dia</Link>
          <Link to="/veiculos">Veículos</Link>
          <Link to="/combustivel">Combustível</Link>
          <Link to="/despesas">Despesas</Link>
        </>
      )}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 14, color: '#666' }}>{usuario?.nome}</span>
        <button onClick={logout} style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Sair
        </button>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/assine" element={<Assine />} />

          {/* Rotas do Motorista */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/registros"
            element={
              <PrivateRoute>
                <RegistroDia />
              </PrivateRoute>
            }
          />
          <Route
            path="/veiculos"
            element={
              <PrivateRoute>
                <Veiculos />
              </PrivateRoute>
            }
          />
          <Route
            path="/combustivel"
            element={
              <PrivateRoute>
                <Combustivel />
              </PrivateRoute>
            }
          />
          <Route
            path="/despesas"
            element={
              <PrivateRoute>
                <Despesas />
              </PrivateRoute>
            }
          />

          {/* Rotas do Admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <PrivateRoute>
                <AdminUsuarios />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/planos"
            element={
              <PrivateRoute>
                <AdminPlanos />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
