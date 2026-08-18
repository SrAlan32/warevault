const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.listar = async (req, res) => {
  const categorias = await prisma.categoria.findMany({
    include: { _count: { select: { productos: true } } },
    orderBy: { nombre: 'asc' },
  });
  res.json(categorias);
};
