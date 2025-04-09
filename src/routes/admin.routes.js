const { Router } = require('express');
const router = Router();

const { 
    renderInicio,
    renderUsuarios, //NUEVO
    renderTransportes, //NUEVO
    renderCargarcamionadm, //NUEVO
    renderRetirarpalletadm, //NUEVO
    renderCambioentrebahiasadm, //NUEVO
    renderTiempos
} = require('../controllers/admin.controller');

router.get('/admin/inicio', renderInicio);
//NUEVO DESDE ACÁ
router.get('/admin/usuarios', renderUsuarios); // <- Nueva ruta
router.get('/admin/transportes', renderTransportes); // <- Nueva ruta
router.get('/admin/cargarcamionadm', renderCargarcamionadm); // <- Nueva ruta
router.get('/admin/retirarpalletadm', renderRetirarpalletadm); // <- Nueva ruta
router.get('/admin/cambioentrebahiasadm', renderCambioentrebahiasadm); // <- Nueva ruta
router.get('/admin/tiempos', renderTiempos); // <- Nueva ruta

module.exports = router;
