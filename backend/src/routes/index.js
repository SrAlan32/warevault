const { Router } = require('express');
const authRoutes = require('./auth.routes');
const categoriaRoutes = require('./categorias.routes');
const productoRoutes = require('./productos.routes');
const movimientoRoutes = require('./movimientos.routes');
const reporteRoutes = require('./reportes.routes');
const usuarioRoutes = require('./usuarios.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/productos', productoRoutes);
router.use('/movimientos', movimientoRoutes);
router.use('/reportes', reporteRoutes);
router.use('/usuarios', usuarioRoutes);

module.exports = router;
