const indexCtrl = {}; // Se crea un objeto vacío que actuará como controlador para las vistas principales

// Renderiza la vista principal o página de inicio
indexCtrl.renderIndex = (req, res) => {
    res.render('index'); // Muestra la vista "index"
};

// Exporta el controlador para poder usarlo en las rutas de la aplicación
module.exports = indexCtrl;
