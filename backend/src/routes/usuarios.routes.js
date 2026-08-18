const { Router } = require('express');
const { listar, crear, actualizar, eliminar } = require('../controllers/usuario.controller');
const { verificarToken, requiereRol } = require('../middleware/auth');

const router = Router();

router.use(verificarToken, requiereRol('ADMIN'));
router.get('/', listar);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

module.exports = router;
