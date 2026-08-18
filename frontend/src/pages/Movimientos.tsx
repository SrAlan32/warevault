import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { api } from '../api/client';
import type { Movimiento, Producto } from '../types';
import Alert from '../components/Alert';
import { formatFecha } from '../utils';

export default function Movimientos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [productoId, setProductoId] = useState('');
  const [tipo, setTipo] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA');
  const [cantidad, setCantidad] = useState('');
  const [nota, setNota] = useState('');
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    try {
      const [p, m] = await Promise.all([api.productos.list(), api.movimientos.historial()]);
      setProductos(p);
      setMovimientos(m.slice(0, 15));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar datos');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function registrar(e: FormEvent) {
    e.preventDefault();
    setError('');
    setAviso('');
    if (!productoId) {
      setError('Selecciona un producto');
      return;
    }
    try {
      await api.movimientos.crear({
        productoId: Number(productoId),
        tipo,
        cantidad: Number(cantidad),
        nota: nota.trim() || undefined,
      });
      setAviso(`Movimiento de ${tipo === 'ENTRADA' ? 'entrada' : 'salida'} registrado correctamente`);
      setCantidad('');
      setNota('');
      cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar movimiento');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Movimientos de inventario</h1>
      <p className="text-sm text-slate-500 mt-1">Registra entradas y salidas de mercancía</p>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Nuevo movimiento</h2>
          <form onSubmit={registrar} className="space-y-4">
            {error && <Alert tipo="error">{error}</Alert>}
            {aviso && <Alert tipo="success">{aviso}</Alert>}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Producto *</label>
              <select
                required
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="">Seleccionar producto...</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (stock: {p.stockActual})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de movimiento *</label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`cursor-pointer border rounded-lg px-4 py-3 text-center text-sm font-medium transition-colors ${
                    tipo === 'ENTRADA'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="tipo"
                    value="ENTRADA"
                    checked={tipo === 'ENTRADA'}
                    onChange={() => setTipo('ENTRADA')}
                    className="sr-only"
                  />
                  Entrada (+)
                </label>
                <label
                  className={`cursor-pointer border rounded-lg px-4 py-3 text-center text-sm font-medium transition-colors ${
                    tipo === 'SALIDA'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="tipo"
                    value="SALIDA"
                    checked={tipo === 'SALIDA'}
                    onChange={() => setTipo('SALIDA')}
                    className="sr-only"
                  />
                  Salida (-)
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cantidad *</label>
              <input
                required
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                placeholder="Ej: 10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nota (opcional)</label>
              <input
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                placeholder="Ej: reposición semanal"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors"
            >
              Registrar movimiento
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">Últimos movimientos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <th className="px-6 py-3">Producto</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3">Cant.</th>
                  <th className="px-6 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cargando ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-center text-slate-400">
                      Cargando...
                    </td>
                  </tr>
                ) : movimientos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-center text-slate-400">
                      No hay movimientos recientes
                    </td>
                  </tr>
                ) : (
                  movimientos.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium text-slate-700">{m.producto?.nombre}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            m.tipo === 'ENTRADA'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {m.tipo === 'ENTRADA' ? 'Entrada' : 'Salida'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-600">{m.cantidad}</td>
                      <td className="px-6 py-3 text-slate-500">{formatFecha(m.fecha)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
