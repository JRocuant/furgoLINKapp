const { Router } = require('express') //Importando el manejador para las rutas
const router = Router()

const { 
    renderInicio
} = require('../controllers/admin.controller'); //directorio de los controladores de rutas

router.get('/admin/inicio', renderInicio);

module.exports = router;