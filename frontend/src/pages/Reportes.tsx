import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Producto } from '../types';
import { formatMoneda } from '../utils';

export default function Reportes() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.reportes
      .bajoStock()
      .then(setProductos)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reporte de bajo stock</h1>
          <p className="text-sm text-slate-500 mt-1">
            Productos cuyo stock actual es igual o menor al stock mínimo
          </p>
        </div>
        <button
          onClick={() => api.reportes.exportar()}
          className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors"
        >
          Exportar CSV
        </button>
      </div>

      {error && <p className="text-red-600 mt-5">Error: {error}</p>}

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {cargando ? (
          <p className="p-8 text-center text-slate-500">Cargando reporte...</p>
        ) : productos.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-emerald-600 font-medium">No hay productos con bajo stock.</p>
            <p className="text-sm text-slate-500 mt-1">Todos los productos están por encima de su stock mínimo.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Categoría</th>
                <th className="px-6 py-3">Stock actual</th>
                <th className="px-6 py-3">Stock mínimo</th>
                <th className="px-6 py-3">Precio venta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-mono text-xs text-slate-500">{p.sku}</td>
                  <td className="px-6 py-3 font-medium text-slate-700">{p.nombre}</td>
                  <td className="px-6 py-3 text-slate-600">{p.categoria?.nombre}</td>
                  <td className="px-6 py-3">
                    <span className="font-bold text-red-600">{p.stockActual}</span>
                  </td>
                  <td className="px-6 py-3 text-slate-500">{p.stockMinimo}</td>
                  <td className="px-6 py-3 text-slate-600">{formatMoneda(p.precioVenta)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
