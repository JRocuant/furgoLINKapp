const { Router } = require('express');
const router = Router();

const { 
    renderInicio,
    renderUsuarios, //NUEVO
    renderTransportes, //NUEVO
    renderCargarCamionAdmin, //NUEVO
    renderRetirarPalletAdmin, //NUEVO
    renderCambioEntreBahiasAdmin, //NUEVO
    renderTiempos
} = require('../controllers/admin.controller');

router.get('/admin/inicio', renderInicio);
//NUEVO DESDE ACÁ
router.get('/admin/usuarios', renderUsuarios); // <- Nueva ruta
router.get('/admin/transportes', renderTransportes); // <- Nueva ruta
router.get('/admin/cargarCamionAdmin', renderCargarCamionAdmin); // <- Nueva ruta
router.get('/admin/retirarPalletAdmin', renderRetirarPalletAdmin); // <- Nueva ruta
router.get('/admin/cambioEntreBahiasAdmin', renderCambioEntreBahiasAdmin); // <- Nueva ruta
router.get('/admin/tiempos', renderTiempos); // <- Nueva ruta

module.exports = router;
