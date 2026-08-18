const { Router } = require('express');
const { crear, historial, historialPorProducto } = require('../controllers/movimiento.controller');
const { verificarToken, requiereRol } = require('../middleware/auth');

const router = Router();

router.use(verificarToken);
router.get('/', historial);
router.get('/producto/:id', historialPorProducto);
router.post('/', requiereRol('ADMIN', 'ALMACENERO'), crear);

module.exports = router;
