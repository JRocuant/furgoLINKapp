const { Router } = require('express') // Importa el módulo Router de Express para definir rutas específicas
const router = Router() // Crea una instancia de Router

// Importa múltiples funciones controladoras desde el archivo tareas.controller
const {               
    seleccion                 
    
} = require('../controllers/tareas.controller'); // ruta desde donde se importan los controladores

/* - - - DEFINICIONES - - -
get  = solicitar recursos o vistas (lectura)
post = enviar datos al servidor para crear algo nuevo
put  = enviar datos al servidor para actualizar recursos existentes
:id  = parámetro dinámico que representa el identificador de una entidad
*/

// Flujo de operaciones adicionales (asociadas a escaneos y estados en la operación)
router.get('/tareas/seleccion', seleccion);                   // Ruta para seleccionar la operación a registrar          // Verifica si el ticket ya fue escaneado (Restricción que ya no aplica)

module.exports = router // Exporta el router para ser usado en la configuración principal del servidor
