import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { DashboardData } from '../types';
import { formatFecha } from '../utils';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.reportes.dashboard().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }
  if (!data) {
    return <p className="text-slate-500">Cargando datos...</p>;
  }

  const tarjetas = [
    { label: 'Productos registrados', valor: data.totalProductos, color: 'bg-brand-600' },
    { label: 'Productos con bajo stock', valor: data.bajoStock, color: 'bg-amber-500' },
    { label: 'Movimientos registrados', valor: data.totalMovimientos, color: 'bg-emerald-600' },
    { label: 'Categorías', valor: data.categorias, color: 'bg-slate-700' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      <p className="text-sm text-slate-500 mt-1">Resumen general del inventario</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {tarjetas.map((t) => (
          <div key={t.label} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className={`w-10 h-10 rounded-lg ${t.color} text-white flex items-center justify-center font-bold`}>
              {t.valor}
            </div>
            <p className="text-sm text-slate-500 mt-3">{t.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Últimos movimientos</h2>
          <Link to="/historial" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            Ver historial completo
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <th className="px-6 py-3">Producto</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3">Cantidad</th>
              <th className="px-6 py-3">Responsable</th>
              <th className="px-6 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.ultimosMovimientos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-slate-400">
                  No hay movimientos registrados
                </td>
              </tr>
            )}
            {data.ultimosMovimientos.map((m) => (
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
                <td className="px-6 py-3 text-slate-600">{m.usuario?.nombre}</td>
                <td className="px-6 py-3 text-slate-500">{formatFecha(m.fecha)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
