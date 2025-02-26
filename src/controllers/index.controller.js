const indexCtrl = {};

indexCtrl.renderIndex = (req,res) =>{
    res.render('index') //Respuesta predeterminada para una request
}

indexCtrl.renderAbout = (req,res) =>{
    res.render('about') //Respuesta predeterminada para una request
}

module.exports = indexCtrl;