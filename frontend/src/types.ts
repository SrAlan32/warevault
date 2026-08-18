export type Rol = 'ADMIN' | 'ALMACENERO';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  activo?: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  _count?: { productos: number };
}

export interface Producto {
  id: number;
  sku: string;
  nombre: string;
  descripcion: string | null;
  precioCompra: number;
  precioVenta: number;
  stockMinimo: number;
  stockActual: number;
  categoriaId: number;
  categoria?: Categoria;
}

export interface Movimiento {
  id: number;
  productoId: number;
  tipo: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  fecha: string;
  usuarioId: number;
  nota: string | null;
  producto?: { nombre: string; sku: string };
  usuario?: { nombre: string; email: string };
}

export interface DashboardData {
  totalProductos: number;
  bajoStock: number;
  totalMovimientos: number;
  categorias: number;
  ultimosMovimientos: Movimiento[];
}
