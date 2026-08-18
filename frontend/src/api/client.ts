import type { Categoria, DashboardData, Movimiento, Producto, Rol, Usuario } from '../types';

const BASE = '/api';

export function getToken(): string | null {
  return localStorage.getItem('warevault_token');
}

function headers(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  const t = getToken();
  if (t) h.Authorization = `Bearer ${t}`;
  return h;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...headers(), ...(options.headers || {}) },
  });
  if (res.status === 401) {
    localStorage.removeItem('warevault_token');
    localStorage.removeItem('warevault_usuario');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || 'Error en la petición');
  }
  return data as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; usuario: Usuario }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  categorias: {
    list: () => request<Categoria[]>('/categorias'),
  },

  productos: {
    list: (params?: { busqueda?: string; categoria?: string }) => {
      const q = new URLSearchParams();
      if (params?.busqueda) q.set('busqueda', params.busqueda);
      if (params?.categoria) q.set('categoria', params.categoria);
      const s = q.toString();
      return request<Producto[]>(`/productos${s ? `?${s}` : ''}`);
    },
    crear: (data: Partial<Producto>) =>
      request<Producto>('/productos', { method: 'POST', body: JSON.stringify(data) }),
    actualizar: (id: number, data: Partial<Producto>) =>
      request<Producto>(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    eliminar: (id: number) =>
      request<{ mensaje: string }>(`/productos/${id}`, { method: 'DELETE' }),
  },

  movimientos: {
    crear: (data: { productoId: number; tipo: 'ENTRADA' | 'SALIDA'; cantidad: number; nota?: string }) =>
      request<Movimiento>('/movimientos', { method: 'POST', body: JSON.stringify(data) }),
    historial: () => request<Movimiento[]>('/movimientos'),
    porProducto: (id: number) =>
      request<{ producto: Producto; movimientos: Movimiento[] }>(`/movimientos/producto/${id}`),
  },

  reportes: {
    bajoStock: () => request<Producto[]>('/reportes/bajo-stock'),
    dashboard: () => request<DashboardData>('/reportes/dashboard'),
    exportar: async () => {
      const t = getToken();
      const res = await fetch(`${BASE}/reportes/bajo-stock/exportar`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) throw new Error('Error al exportar CSV');
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'bajo_stock.csv';
      link.click();
      URL.revokeObjectURL(link.href);
    },
  },

  usuarios: {
    list: () => request<Usuario[]>('/usuarios'),
    crear: (data: { nombre: string; email: string; password: string; rol: Rol }) =>
      request<Usuario>('/usuarios', { method: 'POST', body: JSON.stringify(data) }),
    actualizar: (id: number, data: Partial<Usuario & { password?: string }>) =>
      request<Usuario>(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    eliminar: (id: number) =>
      request<{ mensaje: string }>(`/usuarios/${id}`, { method: 'DELETE' }),
  },
};
