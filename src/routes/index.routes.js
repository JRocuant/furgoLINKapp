const { Router } = require('express')
const router =Router();

const { renderIndex, renderAbout } = require('../controllers/index.controller')

router.get('/', renderIndex) //Respuesta predeterminada para una request

router.get('/about', renderAbout) //Respuesta request about


module.exports = router;
