import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Veiculos from './pages/motorista/Veiculos'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
          <Route path="/" element={<Navigate to="/veiculos" replace />} />
          <Route path="*" element={<Navigate to="/veiculos" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
