import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[url('assets/a-man-in-a-warehouse-in-an-out-balance-position-where-a-stock-of-boxes-might-fell-on-him-dangerous-warehouse-work-.webp')] bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-center bg-slate-900 text-white p-10">
          <h1 className="text-3xl font-bold">WareVault</h1>
          <p className="mt-3 text-slate-400 leading-relaxed">
            Bienvenido a WareVault, inicie sesion con su usuario y contraseña.
          </p>
          <div className="mt-8 space-y-3 text-sm text-slate-300">
            <p>Cualidades de la aplicacion:</p>
            <p>Control de stock en tiempo real</p>
            <p>Alertas automáticas de bajo stock</p>
            <p>Historial completo de movimientos</p>
          </div>
        </div>
        <div className="p-10">
          <h2 className="text-2xl font-bold text-slate-800">Iniciar sesión</h2>
          <p className="text-sm text-slate-500 mt-1">Accede a tu cuenta de WareVault</p>
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            {error && <Alert tipo="error">{error}</Alert>}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="admin@WareVault.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={cargando}
              className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors disabled:opacity-60"
            >
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
          <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-700">¿Olvidaste tu usuario?</p>
            <p>Contacta a un administrador para recuperar tu usuario o contraseña.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
