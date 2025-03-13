const { Router } = require('express') //Importando el manejador para las rutas
const router = Router()

const { 
    renderTareaForm, 
    crearTarea, 
    renderTareas, 
    renderEditForm, 
    updateTarea, 
    eliminarTarea, 
    seleccion,
    espera,
    escanearBahia,
    esperaCargaCamion,
    resumenCargaCamion,
    esperaCambioBahia,
    escanearPalletCambio,
    esperaPallet,
    guardarCargaCamion
} = require('../controllers/tareas.controller'); //directorio de los controladores de rutas

/* - - - DEFINICIONES - - -
get = pedir  
post = recibir (crear algo nuevo)   
put = entregar (actualizar algo existente)
:id = identificador obtenido de manera interna
*/
//Tarea Nueva
router.get('/tareas/add', renderTareaForm);

router.post('/tareas/tarea-nueva', crearTarea);

//Obtener Tareas
router.get('/tareass', renderTareas);

//Editar Tareas
router.get('/tareas/edit/:id', renderEditForm);

router.put('/tareas/edit/:id', updateTarea);

//Eliminar Tareas
router.delete('/tareas/delete/:id', eliminarTarea)

router.get('/tareas/seleccion', seleccion)

router.get('/tareas/espera', espera)

router.get('/tareas/escanearBahia', escanearBahia)

router.get('/tareas/esperaCargaCamion', esperaCargaCamion)

router.get('/tareas/resumenCargaCamion', resumenCargaCamion)

router.get('/tareas/esperaCambioBahia', esperaCambioBahia)

router.get('/tareas/escanearPalletCambio', escanearPalletCambio)

router.get('/tareas/esperaCambioBahia', esperaCambioBahia)

router.get('/tareas/esperaPallet', esperaPallet)

router.post('/tareas/guardarCargaCamion', guardarCargaCamion);


module.exports = router //exportación del Router

