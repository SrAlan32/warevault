const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.listar = async (req, res) => {
  const { busqueda, categoria } = req.query;
  const where = {};
  if (categoria) where.categoriaId = Number(categoria);
  if (busqueda) {
    where.OR = [
      { nombre: { contains: busqueda } },
      { sku: { contains: busqueda } },
      { descripcion: { contains: busqueda } },
    ];
  }
  const productos = await prisma.producto.findMany({
    where,
    include: { categoria: true },
    orderBy: { nombre: 'asc' },
  });
  res.json(productos);
};

exports.obtener = async (req, res) => {
  const producto = await prisma.producto.findUnique({
    where: { id: Number(req.params.id) },
    include: { categoria: true },
  });
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
};

exports.crear = async (req, res) => {
  const {
    sku,
    nombre,
    descripcion,
    precioCompra,
    precioVenta,
    stockMinimo,
    stockActual,
    categoriaId,
  } = req.body;

  if (!sku || !nombre || precioCompra === undefined || precioVenta === undefined || !categoriaId) {
    return res.status(400).json({ error: 'Campos obligatorios incompletos' });
  }

  const existe = await prisma.producto.findUnique({ where: { sku } });
  if (existe) return res.status(409).json({ error: 'Ya existe un producto con ese SKU' });

  const stockInicial = stockActual || 0;

  const producto = await prisma.$transaction(async (tx) => {
    const nuevo = await tx.producto.create({
      data: {
        sku,
        nombre,
        descripcion: descripcion || null,
        precioCompra: Number(precioCompra),
        precioVenta: Number(precioVenta),
        stockMinimo: stockMinimo || 0,
        stockActual: stockInicial,
        categoriaId: Number(categoriaId),
      },
    });
    if (stockInicial > 0) {
      await tx.movimiento.create({
        data: {
          productoId: nuevo.id,
          tipo: 'ENTRADA',
          cantidad: stockInicial,
          usuarioId: req.usuario.id,
          nota: 'Stock inicial al crear producto',
        },
      });
    }
    return nuevo;
  });

  res.status(201).json(producto);
};

exports.actualizar = async (req, res) => {
  const id = Number(req.params.id);
  const producto = await prisma.producto.findUnique({ where: { id } });
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

  const { sku, nombre, descripcion, precioCompra, precioVenta, stockMinimo, categoriaId } = req.body;

  if (sku) {
    const duplicado = await prisma.producto.findUnique({ where: { sku } });
    if (duplicado && duplicado.id !== id) {
      return res.status(409).json({ error: 'Ya existe un producto con ese SKU' });
    }
  }

  const actualizado = await prisma.producto.update({
    where: { id },
    data: {
      sku: sku ?? producto.sku,
      nombre: nombre ?? producto.nombre,
      descripcion: descripcion === undefined ? producto.descripcion : descripcion,
      precioCompra: precioCompra !== undefined ? Number(precioCompra) : producto.precioCompra,
      precioVenta: precioVenta !== undefined ? Number(precioVenta) : producto.precioVenta,
      stockMinimo: stockMinimo !== undefined ? Number(stockMinimo) : producto.stockMinimo,
      categoriaId: categoriaId !== undefined ? Number(categoriaId) : producto.categoriaId,
    },
  });

  res.json(actualizado);
};

exports.eliminar = async (req, res) => {
  const id = Number(req.params.id);
  const producto = await prisma.producto.findUnique({ where: { id } });
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

  const movimientos = await prisma.movimiento.count({ where: { productoId: id } });
  if (movimientos > 0) {
    return res.status(409).json({
      error: 'No se puede eliminar: el producto tiene movimientos registrados',
    });
  }

  await prisma.producto.delete({ where: { id } });
  res.json({ mensaje: 'Producto eliminado correctamente' });
};
