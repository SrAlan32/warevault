const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generarToken } = require('../middleware/auth');

const prisma = new PrismaClient();

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario || !usuario.activo) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const valida = await bcrypt.compare(password, usuario.password);
  if (!valida) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const token = generarToken(usuario);
  res.json({
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
  });
};

exports.perfil = (req, res) => {
  res.json({
    id: req.usuario.id,
    nombre: req.usuario.nombre,
    email: req.usuario.email,
    rol: req.usuario.rol,
  });
};
