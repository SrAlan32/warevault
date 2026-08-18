import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { api } from '../api/client';
import type { Categoria, Producto } from '../types';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import StockBadge from '../components/StockBadge';
import { formatMoneda } from '../utils';

interface FormProducto {
  sku: string;
  nombre: string;
  descripcion: string;
  categoriaId: string;
  precioCompra: string;
  precioVenta: string;
  stockMinimo: string;
  stockActual: string;
}

const vacio: FormProducto = {
  sku: '',
  nombre: '',
  descripcion: '',
  categoriaId: '',
  precioCompra: '',
  precioVenta: '',
  stockMinimo: '0',
  stockActual: '0',
};

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [form, setForm] = useState<FormProducto>(vacio);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([
        api.productos.list({
          busqueda: busqueda || undefined,
          categoria: filtroCategoria || undefined,
        }),
        api.categorias.list(),
      ]);
      setProductos(p);
      setCategorias(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar productos');
    } finally {
      setCargando(false);
    }
  }, [busqueda, filtroCategoria]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  function abrirNuevo() {
    setEditando(null);
    setForm(vacio);
    setError('');
    setModal(true);
  }

  function abrirEditar(p: Producto) {
    setEditando(p);
    setForm({
      sku: p.sku,
      nombre: p.nombre,
      descripcion: p.descripcion || '',
      categoriaId: String(p.categoriaId),
      precioCompra: String(p.precioCompra),
      precioVenta: String(p.precioVenta),
      stockMinimo: String(p.stockMinimo),
      stockActual: String(p.stockActual),
    });
    setError('');
    setModal(true);
  }

  function actualizarCampo(campo: keyof FormProducto, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function guardar(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.categoriaId) {
      setError('Selecciona una categoría');
      return;
    }
    const data = {
      sku: form.sku.trim(),
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      categoriaId: Number(form.categoriaId),
      precioCompra: Number(form.precioCompra),
      precioVenta: Number(form.precioVenta),
      stockMinimo: Number(form.stockMinimo) || 0,
    };
    try {
      if (editando) {
        await api.productos.actualizar(editando.id, data);
        setAviso('Producto actualizado correctamente');
      } else {
        await api.productos.crear({ ...data, stockActual: Number(form.stockActual) || 0 });
        setAviso('Producto creado correctamente');
      }
      setModal(false);
      cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar producto');
    }
  }

  async function eliminar(p: Producto) {
    if (!window.confirm(`¿Eliminar el producto "${p.nombre}"?`)) return;
    setError('');
    try {
      await api.productos.eliminar(p.id);
      setAviso('Producto eliminado correctamente');
      cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar producto');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Productos</h1>
          <p className="text-sm text-slate-500 mt-1">
            {productos.length} productos en el catálogo
          </p>
        </div>
        <button
          onClick={abrirNuevo}
          className="px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors"
        >
          + Nuevo producto
        </button>
      </div>

      {error && (
        <div className="mt-5">
          <Alert tipo="error">{error}</Alert>
        </div>
      )}
      {aviso && (
        <div className="mt-5">
          <Alert tipo="success">{aviso}</Alert>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, SKU o descripción..."
          className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
        />
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        {cargando ? (
          <p className="p-8 text-center text-slate-500">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="p-8 text-center text-slate-400">No se encontraron productos</p>
        ) : (
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Categoría</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Mínimo</th>
                <th className="px-6 py-3">Compra</th>
                <th className="px-6 py-3">Venta</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-mono text-xs text-slate-500">{p.sku}</td>
                  <td className="px-6 py-3 font-medium text-slate-700">{p.nombre}</td>
                  <td className="px-6 py-3 text-slate-600">{p.categoria?.nombre}</td>
                  <td className="px-6 py-3 font-semibold text-slate-800">{p.stockActual}</td>
                  <td className="px-6 py-3 text-slate-500">{p.stockMinimo}</td>
                  <td className="px-6 py-3 text-slate-600">{formatMoneda(p.precioCompra)}</td>
                  <td className="px-6 py-3 text-slate-600">{formatMoneda(p.precioVenta)}</td>
                  <td className="px-6 py-3">
                    <StockBadge stockActual={p.stockActual} stockMinimo={p.stockMinimo} />
                  </td>
                  <td className="px-6 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => abrirEditar(p)}
                      className="text-brand-600 hover:text-brand-800 font-medium mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(p)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal titulo={editando ? 'Editar producto' : 'Nuevo producto'} onClose={() => setModal(false)}>
          <form onSubmit={guardar} className="space-y-4">
            {error && <Alert tipo="error">{error}</Alert>}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU *</label>
                <input
                  required
                  value={form.sku}
                  onChange={(e) => actualizarCampo('sku', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  placeholder="ELC-004"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría *</label>
                <select
                  required
                  value={form.categoriaId}
                  onChange={(e) => actualizarCampo('categoriaId', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="">Seleccionar...</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
              <input
                required
                value={form.nombre}
                onChange={(e) => actualizarCampo('nombre', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => actualizarCampo('descripcion', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Precio compra *</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.precioCompra}
                  onChange={(e) => actualizarCampo('precioCompra', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Precio venta *</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.precioVenta}
                  onChange={(e) => actualizarCampo('precioVenta', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock mínimo</label>
                <input
                  type="number"
                  min="0"
                  value={form.stockMinimo}
                  onChange={(e) => actualizarCampo('stockMinimo', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              {!editando && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock inicial</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stockActual}
                    onChange={(e) => actualizarCampo('stockActual', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold"
              >
                {editando ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
