const tareasCtrl = {};

const Tarea = require('../models/Tarea')
const CargarCamion = require('../models/CargarCamion');

tareasCtrl.renderTareaForm = (req,res) => {
    res.render('tareas/tarea-nueva');
};

tareasCtrl.crearTarea = async (req,res) => {
    console.log(req.body)
    const {idTarea:idTarea} =req.body;
    const newTarea = new Tarea({idTarea});
    console.table(newTarea);
    await newTarea.save()    
    req.flash('success_msg', 'Tarea registrada correctamente');//Mensaje para el servidor
    res.redirect('/tareass')
};

tareasCtrl.renderTareas = async(req,res) => {
    const tareas = await Tarea.find().lean();
    res.render('tareas/all-tareas', { tareas });
};

tareasCtrl.renderEditForm = async(req,res) => {
    const tarea = await Tarea.findById(req.params.id).lean();
    console.log(tarea);
    res.render('tareas/edit-tarea', { tarea });
};

tareasCtrl.updateTarea = async (req,res) => {
    console.log(req.body)
    const {idTarea} = req.body;
    await Tarea.findByIdAndUpdate(req.params.id, {idTarea});
    req.flash('success_msg', 'Tarea actualizada correctamente');//Mensaje para el servidor
    res.redirect('/tareass');
};

tareasCtrl.eliminarTarea = async(req,res) =>{
    await Tarea.findByIdAndDelete(req.params.id);
    res.redirect('/tareass')
};

tareasCtrl.seleccion = (req, res) =>{
    res.render('tareas/seleccion');
};

tareasCtrl.espera = (req, res) =>{
    res.render('tareas/espera');
};

tareasCtrl.escanearBahia = (req, res) =>{
    res.render('tareas/escanearBahia');
};

tareasCtrl.esperaCargaCamion = (req, res) =>{
    res.render('tareas/esperaCargaCamion');
};

tareasCtrl.resumenCargaCamion = (req, res) =>{
    res.render('tareas/resumenCargaCamion');
};

tareasCtrl.esperaCambioBahia = (req, res) =>{
    res.render('tareas/esperaCambioBahia');
};

tareasCtrl.escanearPalletCambio = (req, res) =>{
    res.render('tareas/escanearPalletCambio');
};

tareasCtrl.esperaCambioBahia = (req, res) =>{
    res.render('tareas/esperaCambioBahia');
};

tareasCtrl.esperaPallet = (req, res) =>{
    res.render('tareas/esperaPallet');
};



tareasCtrl.guardarCargaCamion = async (req, res) => {
    try {
        const { codigoTarea, cargas } = req.body;

        const nuevaCarga = new CargarCamion({
            codigoTarea,
            cargas: JSON.stringify(cargas), // Guardamos los pallets como string (o usar array si el modelo lo permite)
            operacionInicio: new Date(),
            operacionFin: new Date(), // Puedes calcularlo más adelante
            turno: "Turno 1", // Reemplazar con dato real si lo tienes
            bahiaCarga: "Bahía 1", // Reemplazar con dato real si lo tienes
            idCamion: 123, // Reemplazar con dato real si lo tienes
            duracion: 30 // Reemplazar con cálculo real si lo necesitas
        });

        await nuevaCarga.save();
        res.status(200).json({ message: "Carga guardada correctamente" });
    } catch (error) {
        console.error("Error al guardar la carga:", error);
        res.status(500).json({ message: "Error al guardar la carga" });
    }
};


module.exports = tareasCtrl;