const { Router } = require('express') //Importando el manejador para las rutas
const router = Router()

const { 
    renderTareaForm, 
    crearTarea, 
    renderTareas, 
    renderEditForm, 
    updateTarea, 
    eliminarTarea 
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

module.exports = router //exportación del Router

