const indexCtrl = {};

indexCtrl.renderIndex = (req, res) => {
    res.render('index')
};

indexCtrl.renderTareas = (req, res) => {
    res.render('tareas')
};

indexCtrl.renderEspera = (req, res) => {
    res.render('espera')
};

module.exports = indexCtrl;