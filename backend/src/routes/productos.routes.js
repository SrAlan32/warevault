const { Router } = require('express');
const {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
} = require('../controllers/producto.controller');
const { verificarToken, requiereRol } = require('../middleware/auth');

const router = Router();

router.use(verificarToken);
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', requiereRol('ADMIN', 'ALMACENERO'), crear);
router.put('/:id', requiereRol('ADMIN', 'ALMACENERO'), actualizar);
router.delete('/:id', requiereRol('ADMIN'), eliminar);

module.exports = router;
