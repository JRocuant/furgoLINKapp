const adminCtrl = {};

adminCtrl.renderInicio = (req,res) => {
    res.render('admin/inicio');
};

//NUEVO DESDE ACÁ
adminCtrl.renderUsuarios = (req,res) => {
    res.render('admin/usuarios');
};

adminCtrl.renderTransportes = (req,res) => {
    res.render('admin/transportes');
};

adminCtrl.renderCargarcamionadm = (req,res) => {
    res.render('admin/cargarcamionadm');
};

adminCtrl.renderRetirarpalletadm = (req,res) => {
    res.render('admin/retirarpalletadm');
};

adminCtrl.renderCambioentrebahiasadm = (req,res) => {
    res.render('admin/cambioentrebahiasadm');
};

adminCtrl.renderTiempos = (req,res) => {
    res.render('admin/tiempos');
};


module.exports = adminCtrl;
