import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Movimientos from './pages/Movimientos';
import Reportes from './pages/Reportes';
import Historial from './pages/Historial';
import Usuarios from './pages/Usuarios';

function RequiereAuth({ children }: { children: JSX.Element }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequiereAuth>
                <Layout />
              </RequiereAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="productos" element={<Productos />} />
            <Route path="movimientos" element={<Movimientos />} />
            <Route path="reportes" element={<Reportes />} />
            <Route path="historial" element={<Historial />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
