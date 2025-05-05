const { Router } = require('express') // Importa el módulo 'Router' desde el paquete Express.

const router = Router(); // Crea una nueva instancia de router para definir rutas específicas de este módulo.

// Importa la función renderIndex desde el archivo los controladores.
const { renderIndex } = require('../controllers/index.controller')

//Define una ruta que renderiza la vista principal.
router.get('/', renderIndex);

module.exports = router; // Exporta el router para ser usado en la configuración principal del servidor

