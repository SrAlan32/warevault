const { Router } = require('express');
const { listar } = require('../controllers/categoria.controller');
const { verificarToken } = require('../middleware/auth');

const router = Router();

router.get('/', verificarToken, listar);

module.exports = router;
