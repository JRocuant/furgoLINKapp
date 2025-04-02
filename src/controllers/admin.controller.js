const adminCtrl = {};


adminCtrl.renderInicio = (req,res) => {
    res.render('admin/inicio');
};

module.exports = adminCtrl;