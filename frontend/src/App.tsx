import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Veiculos from './pages/motorista/Veiculos'
import Combustivel from './pages/motorista/Combustivel'

function NavBar() {
  const { isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) return null

  return (
    <nav style={{ padding: '10px 20px', background: '#f8f9fa', borderBottom: '1px solid #ddd', display: 'flex', gap: 16, alignItems: 'center' }}>
      <Link to="/veiculos">Veículos</Link>
      <Link to="/combustivel">Combustível</Link>
      <div style={{ marginLeft: 'auto' }}>
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
          <Route path="/" element={<Navigate to="/veiculos" replace />} />
          <Route path="*" element={<Navigate to="/veiculos" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
