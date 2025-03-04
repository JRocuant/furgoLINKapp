const tareasCtrl = {};

const Tarea = require('../models/Tarea')

tareasCtrl.renderTareaForm = (req,res) => {
    res.render('tareas/tarea-nueva');
};

tareasCtrl.crearTarea = (req,res) => {
    console.log(req.body)
    const {idTarea:idTarea} =req.body;
    const newTarea = new Tarea({idTarea});
    console.table(newTarea)    
    res.send('Tarea Nueva')
};

tareasCtrl.renderTareas = (req,res) => {
    res.send('Renderizar Tareas')
};

tareasCtrl.renderEditForm = (req,res) => {
    res.send('Renderizar Formulario Edit')
};

tareasCtrl.updateTarea = (req,res) => {
    res.send('Tarea Actualizada')
};

tareasCtrl.eliminarTarea = (req,res) =>{
    res.send('Eliminando Tarea')
};

module.exports = tareasCtrl;