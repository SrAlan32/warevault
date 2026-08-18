import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { api } from '../api/client';
import type { Rol, Usuario } from '../types';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

interface FormUsuario {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}

const vacio: FormUsuario = { nombre: '', email: '', password: '', rol: 'ALMACENERO' };

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState<FormUsuario>(vacio);
  const [passwordNueva, setPasswordNueva] = useState('');
  const [activo, setActivo] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  const cargar = useCallback(async () => {
    const data = await api.usuarios.list();
    setUsuarios(data);
  }, []);

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
  }, [cargar]);

  function abrirNuevo() {
    setEditando(null);
    setForm(vacio);
    setPasswordNueva('');
    setActivo(true);
    setError('');
    setModal(true);
  }

  function abrirEditar(u: Usuario) {
    setEditando(u);
    setForm({ nombre: u.nombre, email: u.email, password: '', rol: u.rol });
    setPasswordNueva('');
    setActivo(u.activo !== false);
    setError('');
    setModal(true);
  }

  async function guardar(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (editando) {
        const data: Record<string, unknown> = {
          nombre: form.nombre,
          email: form.email,
          rol: form.rol,
          activo,
        };
        if (passwordNueva) data.password = passwordNueva;
        await api.usuarios.actualizar(editando.id, data);
        setAviso('Usuario actualizado correctamente');
      } else {
        await api.usuarios.crear({
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          rol: form.rol,
        });
        setAviso('Usuario creado correctamente');
      }
      setModal(false);
      cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar usuario');
    }
  }

  async function eliminar(u: Usuario) {
    if (!window.confirm(`¿Eliminar el usuario "${u.nombre}"?`)) return;
    setError('');
    try {
      await api.usuarios.eliminar(u.id);
      setAviso('Usuario eliminado correctamente');
      cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>
          <p className="text-sm text-slate-500 mt-1">Gestión de usuarios y roles del sistema</p>
        </div>
        <button
          onClick={abrirNuevo}
          className="px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors"
        >
          + Nuevo usuario
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

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Rol</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 font-medium text-slate-700">{u.nombre}</td>
                <td className="px-6 py-3 text-slate-600">{u.email}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      u.rol === 'ADMIN'
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {u.rol === 'ADMIN' ? 'Administrador' : 'Almacenero'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      u.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => abrirEditar(u)}
                    className="text-brand-600 hover:text-brand-800 font-medium mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(u)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal titulo={editando ? 'Editar usuario' : 'Nuevo usuario'} onClose={() => setModal(false)}>
          <form onSubmit={guardar} className="space-y-4">
            {error && <Alert tipo="error">{error}</Alert>}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
              <input
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {editando ? 'Nueva contraseña (opcional)' : 'Contraseña *'}
              </label>
              <input
                required={!editando}
                type="password"
                value={editando ? passwordNueva : form.password}
                onChange={(e) =>
                  editando ? setPasswordNueva(e.target.value) : setForm({ ...form, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rol *</label>
              <select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value as Rol })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="ADMIN">Administrador</option>
                <option value="ALMACENERO">Almacenero</option>
              </select>
            </div>
            {editando && (
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="rounded border-slate-300"
                />
                Usuario activo
              </label>
            )}
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
                {editando ? 'Guardar cambios' : 'Crear usuario'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
