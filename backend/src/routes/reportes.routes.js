const { Router } = require('express');
const { bajoStock, dashboard, exportarBajoStock } = require('../controllers/reporte.controller');
const { verificarToken } = require('../middleware/auth');

const router = Router();

router.use(verificarToken);
router.get('/bajo-stock', bajoStock);
router.get('/bajo-stock/exportar', exportarBajoStock);
router.get('/dashboard', dashboard);

module.exports = router;
