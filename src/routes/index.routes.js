// Importa el módulo 'Router' desde el paquete Express.
// 'Router' permite definir rutas de forma modular y organizada.
const { Router } = require('express')

// Crea una nueva instancia de router para definir rutas específicas de este módulo.
const router = Router();

// Importa la función controladora 'renderIndex' desde el archivo 'index.controller'.
// Esta función se encarga de manejar la lógica cuando se accede a la ruta raíz ('/').
const { renderIndex } = require('../controllers/index.controller')

// Define una ruta GET para la raíz del sitio ('/'), que renderiza la vista principal.
// Normalmente es la página de inicio o bienvenida del sistema.
router.get('/', renderIndex);

// Exporta el router para que pueda ser utilizado en otros módulos, como el archivo principal del servidor.
module.exports = router;
