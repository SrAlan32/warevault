import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Movimiento, Producto } from '../types';
import { formatFecha } from '../utils';

export default function Historial() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [seleccionado, setSeleccionado] = useState('');
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [productoActual, setProductoActual] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.productos.list().then(setProductos).finally(() => setCargando(false));
  }, []);

  async function consultar() {
    if (!seleccionado) return;
    const res = await api.movimientos.porProducto(Number(seleccionado));
    setProductoActual(res.producto);
    setMovimientos(res.movimientos);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Historial de movimientos</h1>
      <p className="text-sm text-slate-500 mt-1">Consulta el historial de entradas y salidas por producto</p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
        <select
          value={seleccionado}
          onChange={(e) => setSeleccionado(e.target.value)}
          className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
        >
          <option value="">Seleccionar producto...</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} ({p.sku})
            </option>
          ))}
        </select>
        <button
          onClick={consultar}
          disabled={!seleccionado}
          className="px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors disabled:opacity-50"
        >
          Consultar
        </button>
      </div>

      {productoActual && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">{productoActual.nombre}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                SKU: {productoActual.sku} - Stock actual: {productoActual.stockActual}
              </p>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Cantidad</th>
                <th className="px-6 py-3">Responsable</th>
                <th className="px-6 py-3">Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movimientos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-slate-400">
                    Este producto no tiene movimientos registrados
                  </td>
                </tr>
              )}
              {movimientos.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-slate-500">{formatFecha(m.fecha)}</td>
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
                  <td className="px-6 py-3 font-semibold text-slate-800">{m.cantidad}</td>
                  <td className="px-6 py-3 text-slate-600">{m.usuario?.nombre}</td>
                  <td className="px-6 py-3 text-slate-500">{m.nota || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
