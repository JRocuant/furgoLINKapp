const apoderadoCtrl = {}; // Objeto que almacenará todas las funciones controladoras relacionadas a tareas



// Renderiza vista de selección de tarea
apoderadoCtrl.renderInicioApoderado = (req, res) => {
    res.render('apoderado/inicio_apoderado'); // Renderiza vista para selección de tipo de tarea
};

module.exports = apoderadoCtrl; // Exporta el objeto con todas las funciones del controlador
