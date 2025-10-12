const { Router } = require('express'); // Importa Router desde Express
const router = Router(); // Crea una instancia de Router

// Importa múltiples funciones controladoras desde el archivo users.controller
const { 
    renderInicioApoderado
                                                        
} = require('../controllers/apoderado.controller')                   

router.get('/apoderado/inicio', renderInicioApoderado); // Ruta para formulario de registro


module.exports = router; // Exporta el router para ser usado en la configuración principal del servidor
