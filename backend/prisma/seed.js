const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  const passwordAdmin = await bcrypt.hash('Admin123!', 10);
  const passwordAlmacen = await bcrypt.hash('Almacen123!', 10);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@warevault.com' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@warevault.com',
      password: passwordAdmin,
      rol: 'ADMIN',
    },
  });

  const almacenero = await prisma.usuario.upsert({
    where: { email: 'almacenero@warevault.com' },
    update: {},
    create: {
      nombre: 'Almacenero Demo',
      email: 'almacenero@warevault.com',
      password: passwordAlmacen,
      rol: 'ALMACENERO',
    },
  });

  console.log('Usuarios creados:', admin.email, '/', almacenero.email);

  const categorias = {
    electronica: await prisma.categoria.upsert({
      where: { nombre: 'Electrónica' },
      update: {},
      create: { nombre: 'Electrónica' },
    }),
    abarrotes: await prisma.categoria.upsert({
      where: { nombre: 'Abarrotes' },
      update: {},
      create: { nombre: 'Abarrotes' },
    }),
    limpieza: await prisma.categoria.upsert({
      where: { nombre: 'Limpieza' },
      update: {},
      create: { nombre: 'Limpieza' },
    }),
    oficina: await prisma.categoria.upsert({
      where: { nombre: 'Oficina' },
      update: {},
      create: { nombre: 'Oficina' },
    }),
  };

  console.log('Categorías creadas.');

  const productos = [
    {
      sku: 'ELC-001',
      nombre: 'Auriculares Bluetooth',
      descripcion: 'Auriculares inalámbricos con estuche de carga',
      precioCompra: 20,
      precioVenta: 39.99,
      stockMinimo: 10,
      stockActual: 35,
      categoriaId: categorias.electronica.id,
    },
    {
      sku: 'ELC-002',
      nombre: 'Teclado USB',
      descripcion: 'Teclado mecánico retroiluminado',
      precioCompra: 25,
      precioVenta: 45,
      stockMinimo: 8,
      stockActual: 5,
      categoriaId: categorias.electronica.id,
    },
    {
      sku: 'ELC-003',
      nombre: 'Mouse Inalámbrico',
      descripcion: 'Mouse óptico 2.4 GHz',
      precioCompra: 8,
      precioVenta: 15.5,
      stockMinimo: 15,
      stockActual: 12,
      categoriaId: categorias.electronica.id,
    },
    {
      sku: 'ABR-001',
      nombre: 'Arroz 5kg',
      descripcion: 'Arroz blanco premium 5 kilogramos',
      precioCompra: 4,
      precioVenta: 6.75,
      stockMinimo: 20,
      stockActual: 60,
      categoriaId: categorias.abarrotes.id,
    },
    {
      sku: 'ABR-002',
      nombre: 'Frijoles 2kg',
      descripcion: 'Frijoles rojos 2 kilogramos',
      precioCompra: 3.5,
      precioVenta: 5.25,
      stockMinimo: 15,
      stockActual: 3,
      categoriaId: categorias.abarrotes.id,
    },
    {
      sku: 'LIM-001',
      nombre: 'Detergente 1kg',
      descripcion: 'Detergente en polvo aroma limón',
      precioCompra: 2.2,
      precioVenta: 3.8,
      stockMinimo: 10,
      stockActual: 25,
      categoriaId: categorias.limpieza.id,
    },
    {
      sku: 'OFI-001',
      nombre: 'Resma de papel A4',
      descripcion: 'Resma 500 hojas tamaño carta',
      precioCompra: 4.5,
      precioVenta: 7,
      stockMinimo: 12,
      stockActual: 18,
      categoriaId: categorias.oficina.id,
    },
    {
      sku: 'OFI-002',
      nombre: 'Bolígrafos (pack 12)',
      descripcion: 'Pack de bolígrafos azules',
      precioCompra: 3,
      precioVenta: 5.5,
      stockMinimo: 10,
      stockActual: 7,
      categoriaId: categorias.oficina.id,
    },
  ];

  for (const p of productos) {
    const existe = await prisma.producto.findUnique({ where: { sku: p.sku } });
    if (!existe) {
      const creado = await prisma.producto.create({ data: p });
      await prisma.movimiento.create({
        data: {
          productoId: creado.id,
          tipo: 'ENTRADA',
          cantidad: p.stockActual,
          usuarioId: admin.id,
          nota: 'Stock inicial',
        },
      });
    }
  }

  console.log('Productos y movimientos iniciales creados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
