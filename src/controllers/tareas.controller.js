const tareasCtrl = {};

const Tarea = require('../models/Tarea')

tareasCtrl.renderTareaForm = (req,res) => {
    res.render('tareas/tarea-nueva');
};

tareasCtrl.crearTarea = async (req,res) => {
    console.log(req.body)
    const {idTarea:idTarea} =req.body;
    const newTarea = new Tarea({idTarea});
    console.table(newTarea);
    await newTarea.save()    
    res.send('Tarea Nueva')
};

tareasCtrl.renderTareas = async(req,res) => {
    const tareas = await Tarea.find();
    res.render('tareas/all-tareas');
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