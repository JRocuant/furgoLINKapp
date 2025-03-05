const { Router } = require('express')
const router = Router();

//TODO: José, Asignar API keys a las rutas.

const { renderIndex, renderTareas, renderEspera } = require('../controllers/index.controller')

router.get('/', renderIndex);

router.get('/tareas', renderTareas);

router.get('/espera', renderEspera);

module.exports = router;