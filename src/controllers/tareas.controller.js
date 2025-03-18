const tareasCtrl = {};

const Tarea = require('../models/Tarea')
const CargarCamion = require('../models/CargarCamion');
const RetirarPallet = require('../models/RetirarPallet');
const CambioBahia = require('../models/CambioBahia');

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
        const { codigoTarea, cargas, operacionInicio, duracionSegundos, codigoEscaneado } = req.body;

        const nuevaCarga = new CargarCamion({
            operacionInicio: operacionInicio,
            operacionFin: new Date().toISOString(),
            codigoTicket: codigoEscaneado,
            turno: "Mañana", // Reemplazar con funcion que calcula el dato real
            codigoTarea: codigoTarea,
            cargas: JSON.stringify(cargas), 
            transporte: 6202160, 
            duracion: duracionSegundos 
        });

        await nuevaCarga.save();
        res.status(200).json({ message: "Carga guardada correctamente" });
    } catch (error) {
        console.error("Error al guardar la carga:", error);
        res.status(500).json({ message: "Error al guardar la carga" });
    }
};

tareasCtrl.guardarPalletListo = async (req, res) => {
    try {
        const { codigoTarea, codigoBahia, operacionInicio, operacionFin, duracionSegundos, codigoEscaneado/*, duracionSegundos, codigoEscaneado, bahiaEscaneada*/ } = req.body;

        const palletListo = new RetirarPallet({
            operacionInicio: operacionInicio,
            operacionFin: operacionFin, // Calcularlo más adelante
            codigoTicket: codigoEscaneado,
            turno: "Mañana", // Reemplazar con funcion que calcula el dato real
            codigoTarea: codigoTarea,
            bahiaCarga: codigoBahia, // Reemplazar con dato real
            transporte: 6202160, // Reemplazar con dato real 
            duracion: duracionSegundos // Reemplazar con cálculo real



           /* 
           -----------------------------
            codigoTarea: ultimaTarea.codigoTarea,
            codigoBahia: tareaActual.codigoBahia,
            operacionInicio: ultimaTarea.operacionInicio,
            operacionFin: operacionFin,
            duracionSegundos: duracion.formatoLegible,
            codigoEscaneado: ultimaTarea.codigoEscaneado
            -----------------------------------
           
           operacionInicio: { type: Date },
            operacionFin: { type: Date },
            codigoTicket: { type: Number },
            turno: { type: String },
            codigoTarea: { type: String },
            bahiaCarga: { type: Number },
            transporte: { type: Number },
            duracion: { type: String }*/
            
        });

        await palletListo.save();
        res.status(200).json({ message: "Carga guardada correctamente" });
    } catch (error) {
        console.error("Error al guardar la carga:", error);
        res.status(500).json({ message: "Error al guardar la carga" });
    }
};

tareasCtrl.guardarCambioBahia = async (req, res) => {
    try {
        const { codigoTarea } = req.body;

        const cargaCambiada = new CambioBahia({
            codigoTarea,
            cargas: JSON.stringify(cargas), // Guardamos los pallets como string (o usar array si el modelo lo permite)
            operacionInicio: new Date(),
            operacionFin: new Date(), //  Calcularlo más adelante
            turno: "Mañana", // Reemplazar con funcion que calcula el dato real
            bahiaCarga: "Bahía 1", // Reemplazar con dato real
            idCamion: 123, // Reemplazar con dato real 
            duracion: 30 // Reemplazar con cálculo real
        });

        await cargaCambiada.save();
        res.status(200).json({ message: "Carga guardada correctamente" });
    } catch (error) {
        console.error("Error al guardar la carga:", error);
        res.status(500).json({ message: "Error al guardar la carga" });
    }
};


module.exports = tareasCtrl;