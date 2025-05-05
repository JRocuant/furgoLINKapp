const { Router } = require('express') // Importa el módulo Router de Express para definir rutas específicas
const router = Router() // Crea una instancia de Router

// Importa múltiples funciones controladoras desde el archivo tareas.controller
const {               
    seleccion,                   
    espera,                      
    escanearBahia,              
    esperaCargaCamion,          
    resumenCargaCamion,         
    esperaCambioBahia,          
    escanearPalletCambio,       
    esperaPallet,               
    guardarCargaCamion,         
    guardarCambioBahia,         
    guardarPalletListo,         
    verificarTicket             
} = require('../controllers/tareas.controller'); // ruta desde donde se importan los controladores

/* - - - DEFINICIONES - - -
get  = solicitar recursos o vistas (lectura)
post = enviar datos al servidor para crear algo nuevo
put  = enviar datos al servidor para actualizar recursos existentes
:id  = parámetro dinámico que representa el identificador de una entidad
*/

// Flujo de operaciones adicionales (asociadas a escaneos y estados en la operación)
router.get('/tareas/seleccion', seleccion);                   // Ruta para seleccionar la operación a registrar
router.get('/tareas/espera', espera);                         // Ruta de espera por código ticket
router.get('/tareas/escanearBahia', escanearBahia);           // Función para confirmar retiro de pallet
router.get('/tareas/esperaCargaCamion', esperaCargaCamion);   // Escanear código ticket para iniciar carga de camión
router.get('/tareas/resumenCargaCamion', resumenCargaCamion); // Función para confirmar carga de camión
router.get('/tareas/esperaCambioBahia', esperaCambioBahia);   // Escanear código ticket para iniciar operación cambio de bahía
router.get('/tareas/escanearPalletCambio', escanearPalletCambio); // Función para confirmar cambio de bahía  

router.get('/tareas/esperaPallet', esperaPallet);             // Vista de espera hasta que el pallet esté listo

// Procesamiento de datos
router.post('/tareas/guardarCargaCamion', guardarCargaCamion);     // Guarda la información de la carga del camión
router.post('/tareas/guardarCambioBahia', guardarCambioBahia);     // Guarda la información sobre el cambio de bahía
router.post('/tareas/guardarPalletListo', guardarPalletListo);     // Guarda la información sobre el pallet retirado
router.post('/tareas/verificarTicket', verificarTicket);           // Verifica si el ticket ya fue escaneado (Restricción que ya no aplica)

module.exports = router // Exporta el router para ser usado en la configuración principal del servidor
