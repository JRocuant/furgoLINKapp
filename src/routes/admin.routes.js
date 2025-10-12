const { Router } = require('express'); // Importa el módulo 'Router' desde Express, que permite crear rutas modulares y montables.

const router = Router(); // Inicializa una nueva instancia de Router para definir rutas específicas de la aplicación.

// Importa funciones controladoras desde el archivo admin.controller.
// Estas funciones son las encargadas de procesar las solicitudes y renderizar las vistas respectivas del panel de administración.
const { 
    renderInicio          
} = require('../controllers/admin.controller');

// Ruta para renderizar la página de inicio del administrador.
router.get('/admin/inicio', renderInicio);

module.exports = router; // Exporta el router para ser usado en la configuración principal del servidor
