const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.crear = async (req, res) => {
  const { productoId, tipo, cantidad, nota } = req.body;

  if (!productoId || !tipo || !cantidad) {
    return res.status(400).json({ error: 'Producto, tipo y cantidad son obligatorios' });
  }
  if (cantidad <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
  }
  if (!['ENTRADA', 'SALIDA'].includes(tipo)) {
    return res.status(400).json({ error: 'El tipo debe ser ENTRADA o SALIDA' });
  }

  const producto = await prisma.producto.findUnique({ where: { id: Number(productoId) } });
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

  try {
    const movimiento = await prisma.$transaction(async (tx) => {
      const nuevoStock =
        tipo === 'ENTRADA' ? producto.stockActual + cantidad : producto.stockActual - cantidad;

      if (nuevoStock < 0) {
        throw new Error('Stock insuficiente para realizar la salida');
      }

      const mov = await tx.movimiento.create({
        data: {
          productoId: producto.id,
          tipo,
          cantidad: Number(cantidad),
          usuarioId: req.usuario.id,
          nota: nota || null,
        },
      });

      await tx.producto.update({
        where: { id: producto.id },
        data: { stockActual: nuevoStock },
      });

      return mov;
    });

    res.status(201).json({
      ...movimiento,
      stockActual: tipo === 'ENTRADA' ? producto.stockActual + cantidad : producto.stockActual - cantidad,
    });
  } catch (e) {
    if (e.message === 'Stock insuficiente para realizar la salida') {
      return res.status(400).json({ error: e.message });
    }
    throw e;
  }
};

exports.historialPorProducto = async (req, res) => {
  const productoId = Number(req.params.id);
  const producto = await prisma.producto.findUnique({ where: { id: productoId } });
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

  const movimientos = await prisma.movimiento.findMany({
    where: { productoId },
    include: { usuario: { select: { nombre: true, email: true } } },
    orderBy: { fecha: 'desc' },
  });

  res.json({ producto, movimientos });
};

exports.historial = async (req, res) => {
  const movimientos = await prisma.movimiento.findMany({
    include: {
      producto: { select: { nombre: true, sku: true } },
      usuario: { select: { nombre: true, email: true } },
    },
    orderBy: { fecha: 'desc' },
    take: 100,
  });
  res.json(movimientos);
};
