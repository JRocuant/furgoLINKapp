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
    const cargarcamions = await CargarCamion.find().lean();
    res.render('tareas/all-tareas', { cargarcamions });
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


//Función para almacenar información de la operación Cargar camion
tareasCtrl.guardarCargaCamion = async (req, res) => {
    try {
        const { codigoTarea, cargas, operacionInicio, operacionFin, duracionSegundos, codigoEscaneado, transporte, turno, idUsuario } = req.body;
        /*
        TODO: const codigoTicket = CargarCamion.find({"codigoTicket" : "00068888600000000000000000001"});
        console.log(codigoTicket)*/

        const nuevaCarga = new CargarCamion({
            operacionInicio: operacionInicio,
            operacionFin: operacionFin,
            codigoTicket: codigoEscaneado,
            turno: turno,
            codigoTarea: codigoTarea,
            cargas: JSON.stringify(cargas), 
            transporte: transporte, 
            duracion: duracionSegundos,
            idUsuario: idUsuario  
        });

        await nuevaCarga.save();
        res.status(200).json({ message: "Carga guardada correctamente" });
    } catch (error) {
        console.error("Error al guardar la carga:", error);
        res.status(500).json({ message: "Error al guardar la carga" });
    }
};


//Función para almacenar información de la operación Retirar Pallet
tareasCtrl.guardarPalletListo = async (req, res) => { 
    try {
        const { codigoTarea, codigoBahia, operacionInicio, operacionFin, duracionSegundos, codigoEscaneado, transporte, turno, idUsuario } = req.body;

        const palletListo = new RetirarPallet({
            operacionInicio: operacionInicio,
            operacionFin: operacionFin, 
            codigoTicket: codigoEscaneado,
            turno: turno, 
            codigoTarea: codigoTarea,
            bahiaCarga: codigoBahia, 
            transporte: transporte, 
            duracion: duracionSegundos,
            idUsuario: idUsuario  

        });

        await palletListo.save();
        res.status(200).json({ message: "Carga guardada correctamente" });
    } catch (error) {
        console.error("Error al guardar la carga:", error);
        res.status(500).json({ message: "Error al guardar la carga" });
    }
};

//Función para almacenar información de la operación Cambio de Bahía
tareasCtrl.guardarCambioBahia = async (req, res) => {
    try {
        const { operacionInicio, operacionFin, codigoEscaneado, codigoTarea, palletConfirmado, bahiaInicial, bahiaDestino, transporte, turno, duracionSegundos, idUsuario} = req.body;

        const cargaCambiada = new CambioBahia({
            operacionInicio: operacionInicio,
            operacionFin: operacionFin,
            codigoTicket: codigoEscaneado,
            turno: turno,
            codigoTarea: codigoTarea,
            palletCambiado: palletConfirmado,
            bahiaInicial: bahiaInicial,
            bahiaFinal: bahiaDestino,
            transporte: transporte, 
            duracion: duracionSegundos,
            idUsuario: idUsuario 
    
        });

        await cargaCambiada.save();
        res.status(200).json({ message: "Carga guardada correctamente" });
    } catch (error) {
        console.error("Error al guardar la carga:", error);
        res.status(500).json({ message: "Error al guardar la carga" });
    }
};

// Verificar si el código de ticket ya existe en la colección CargarCamion
tareasCtrl.verificarTicket = async (req, res) => {
    try {
        const { codigoTicket } = req.body;
        const ticketExistente = await CargarCamion.findOne({ codigoTicket: codigoTicket });

        if (ticketExistente) {
            res.status(200).json({ exists: true, message: "El código ya existe" });
        } else {
            res.status(200).json({ exists: false, message: "El código es válido" });
        }
    } catch (error) {
        console.error("Error al verificar el ticket:", error);
        res.status(500).json({ message: "Error en la verificación" });
    }
};


module.exports = tareasCtrl;