import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/productos', label: 'Productos', end: false },
  { to: '/movimientos', label: 'Movimientos', end: false },
  { to: '/reportes', label: 'Bajo Stock', end: false },
  { to: '/historial', label: 'Historial', end: false },
  { to: '/usuarios', label: 'Usuarios', end: false },
];

export default function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function cerrarSesion() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 w-60 bg-slate-900 text-slate-300 flex flex-col">
        <div className="px-6 py-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-tight">WareVault</h1>
          <p className="text-xs text-slate-500 mt-1">Gestión de Inventario</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white font-semibold text-sm">
              {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{usuario?.nombre}</p>
              <p className="text-xs text-slate-500 truncate">{usuario?.rol}</p>
            </div>
            <button
              onClick={cerrarSesion}
              className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded px-2 py-1"
            >
              Salir
            </button>
          </div>
        </div>
      </aside>
      <main className="ml-60 p-8">
        <Outlet />
      </main>
    </div>
  );
}
