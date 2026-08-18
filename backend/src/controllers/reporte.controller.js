const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.bajoStock = async (req, res) => {
  const productos = await prisma.producto.findMany({
    where: {
      stockActual: { lte: prisma.producto.fields.stockMinimo },
    },
    include: { categoria: true },
    orderBy: [{ stockMinimo: 'asc' }, { nombre: 'asc' }],
  });
  res.json(productos);
};

exports.dashboard = async (req, res) => {
  const [totalProductos, bajoStock, totalMovimientos, categorias] = await Promise.all([
    prisma.producto.count(),
    prisma.producto.count({
      where: { stockActual: { lte: prisma.producto.fields.stockMinimo } },
    }),
    prisma.movimiento.count(),
    prisma.categoria.count(),
  ]);

  const ultimosMovimientos = await prisma.movimiento.findMany({
    include: {
      producto: { select: { nombre: true } },
      usuario: { select: { nombre: true } },
    },
    orderBy: { fecha: 'desc' },
    take: 8,
  });

  res.json({ totalProductos, bajoStock, totalMovimientos, categorias, ultimosMovimientos });
};

exports.exportarBajoStock = async (req, res) => {
  const productos = await prisma.producto.findMany({
    where: { stockActual: { lte: prisma.producto.fields.stockMinimo } },
    include: { categoria: true },
    orderBy: { nombre: 'asc' },
  });

  const filas = [
    ['SKU', 'Nombre', 'Categoría', 'Stock Actual', 'Stock Mínimo', 'Precio Venta'],
    ...productos.map((p) => [
      p.sku,
      p.nombre,
      p.categoria.nombre,
      p.stockActual,
      p.stockMinimo,
      p.precioVenta,
    ]),
  ];

  const csv = filas.map((f) => f.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=bajo_stock.csv');
  res.send('\uFEFF' + csv);
};
