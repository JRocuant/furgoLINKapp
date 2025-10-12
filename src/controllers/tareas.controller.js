const tareasCtrl = {}; // Objeto que almacenará todas las funciones controladoras relacionadas a tareas



// Renderiza vista de selección de tarea
tareasCtrl.seleccion = (req, res) => {
    res.render('tareas/seleccion'); // Renderiza vista para selección de tipo de tarea
};

module.exports = tareasCtrl; // Exporta el objeto con todas las funciones del controlador
