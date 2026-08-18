const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.listar = async (req, res) => {
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      activo: true,
      createdAt: true,
      _count: { select: { movimientos: true } },
    },
    orderBy: { nombre: 'asc' },
  });
  res.json(usuarios);
};

exports.crear = async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ error: 'Nombre, email, contraseña y rol son obligatorios' });
  }
  if (!['ADMIN', 'ALMACENERO'].includes(rol)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }
  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) return res.status(409).json({ error: 'Ya existe un usuario con ese email' });

  const passwordHash = await bcrypt.hash(password, 10);
  const usuario = await prisma.usuario.create({
    data: { nombre, email, password: passwordHash, rol },
    select: { id: true, nombre: true, email: true, rol: true, activo: true },
  });
  res.status(201).json(usuario);
};

exports.actualizar = async (req, res) => {
  const id = Number(req.params.id);
  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  const { nombre, email, password, rol, activo } = req.body;

  const data = {};
  if (nombre !== undefined) data.nombre = nombre;
  if (email !== undefined) data.email = email;
  if (rol !== undefined) data.rol = rol;
  if (activo !== undefined) data.activo = Boolean(activo);
  if (password) data.password = await bcrypt.hash(password, 10);

  const actualizado = await prisma.usuario.update({
    where: { id },
    data,
    select: { id: true, nombre: true, email: true, rol: true, activo: true },
  });
  res.json(actualizado);
};

exports.eliminar = async (req, res) => {
  const id = Number(req.params.id);
  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  if (usuario.rol === 'ADMIN') {
    const admins = await prisma.usuario.count({ where: { rol: 'ADMIN' } });
    if (admins <= 1) {
      return res.status(400).json({ error: 'No se puede eliminar el último administrador' });
    }
  }
  if (usuario.id === req.usuario.id) {
    return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
  }

  await prisma.usuario.delete({ where: { id } });
  res.json({ mensaje: 'Usuario eliminado correctamente' });
};
