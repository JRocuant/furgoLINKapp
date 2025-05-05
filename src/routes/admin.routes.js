const { Router } = require('express'); // Importa el módulo 'Router' desde Express, que permite crear rutas modulares y montables.

const router = Router(); // Inicializa una nueva instancia de Router para definir rutas específicas de la aplicación.

// Importa funciones controladoras desde el archivo admin.controller.
// Estas funciones son las encargadas de procesar las solicitudes y renderizar las vistas respectivas del panel de administración.
const { 
    renderInicio,                  
    renderUsuarios,               
    renderTransportes,            
    renderCargarCamionAdmin,      
    renderRetirarPalletAdmin,     
    renderCambioEntreBahiasAdmin, 
    renderTiempoReal              
} = require('../controllers/admin.controller');

// Ruta para renderizar la página de inicio del administrador.
router.get('/admin/inicio', renderInicio);

// Ruta para la vista de usuarios en el panel administrativo.
router.get('/admin/usuarios', renderUsuarios);

// Ruta para la sección de transportes.
router.get('/admin/transportes', renderTransportes);

// Ruta para la interfaz de carga de camiones, exclusiva para administradores.
router.get('/admin/cargarCamionAdmin', renderCargarCamionAdmin);

// Ruta para el módulo de retiro de pallets, exclusiva para administradores.
router.get('/admin/retirarPalletAdmin', renderRetirarPalletAdmin);

// Ruta que gestiona el cambio de pallets entre bahías en el modo administrador.
router.get('/admin/cambioEntreBahiasAdmin', renderCambioEntreBahiasAdmin);

// Ruta que muestra datos o indicadores en tiempo real en el panel de administración.
router.get('/admin/tiempos', renderTiempoReal);

// Exporta el objeto router para que pueda ser utilizado en otras partes de la aplicación.
module.exports = router;
