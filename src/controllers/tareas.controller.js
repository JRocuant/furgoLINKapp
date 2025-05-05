const tareasCtrl = {}; // Objeto que almacenará todas las funciones controladoras relacionadas a tareas

// Importación de modelos utilizados en las operaciones
//const Tarea = require('../models/Tarea'); // Modelo de Tarea general
const CargarCamion = require('../models/CargarCamion'); // Modelo para operaciones de carga de camiones
const RetirarPallet = require('../models/RetirarPallet'); // Modelo para operaciones de retiro de pallets
const CambioBahia = require('../models/CambioBahia'); // Modelo para operaciones de cambio de bahía

// Renderiza el formulario para crear una nueva tarea
tareasCtrl.renderTareaForm = (req, res) => {
    res.render('tareas/tarea-nueva'); // Renderiza la vista 'tarea-nueva'
};

// Crea una nueva tarea y la guarda en la base de datos
tareasCtrl.crearTarea = async (req, res) => {
    console.log(req.body); // Muestra el cuerpo de la solicitud en consola (debug)
    const { idTarea: idTarea } = req.body; // Extrae el campo idTarea del cuerpo
    const newTarea = new Tarea({ idTarea }); // Crea una nueva instancia del modelo Tarea
    console.table(newTarea); // Muestra la nueva tarea en formato tabla (debug)
    await newTarea.save(); // Guarda la tarea en la base de datos
    req.flash('success_msg', 'Tarea registrada correctamente'); // Notifica éxito al usuario
    res.redirect('/tareass'); // Redirige a la vista general de tareas
};

// Renderiza la vista que muestra todas las tareas (de tipo CargarCamion)
tareasCtrl.renderTareas = async (req, res) => {
    const cargarcamions = await CargarCamion.find().lean(); // Obtiene todos los documentos de CargarCamion
    res.render('tareas/all-tareas', { cargarcamions }); // Renderiza la vista con los datos obtenidos
};

// Renderiza el formulario de edición de una tarea específica
tareasCtrl.renderEditForm = async (req, res) => {
    const tarea = await Tarea.findById(req.params.id).lean(); // Busca la tarea por ID
    console.log(tarea); // Muestra la tarea en consola (debug)
    res.render('tareas/edit-tarea', { tarea }); // Renderiza la vista de edición con los datos de la tarea
};

// Actualiza los datos de una tarea existente
tareasCtrl.updateTarea = async (req, res) => {
    console.log(req.body); // Muestra el cuerpo de la solicitud (debug)
    const { idTarea } = req.body; // Extrae el nuevo idTarea del cuerpo
    await Tarea.findByIdAndUpdate(req.params.id, { idTarea }); // Actualiza la tarea en la base de datos
    req.flash('success_msg', 'Tarea actualizada correctamente'); // Notifica éxito
    res.redirect('/tareass'); // Redirige a la lista de tareas
};

// Elimina una tarea existente
tareasCtrl.eliminarTarea = async (req, res) => {
    await Tarea.findByIdAndDelete(req.params.id); // Elimina la tarea por ID
    res.redirect('/tareass'); // Redirige a la lista de tareas
};

// Renderiza vista de selección de tarea
tareasCtrl.seleccion = (req, res) => {
    res.render('tareas/seleccion'); // Renderiza vista para selección de tipo de tarea
};

// Renderiza pantalla de espera
tareasCtrl.espera = (req, res) => {
    res.render('tareas/espera'); // Vista de espera genérica
};

// Renderiza vista para escaneo de bahía
tareasCtrl.escanearBahia = (req, res) => {
    res.render('tareas/escanearBahia'); // Vista para escanear una bahía
};

// Renderiza pantalla de espera durante carga de camión
tareasCtrl.esperaCargaCamion = (req, res) => {
    res.render('tareas/esperaCargaCamion');
};

// Renderiza resumen tras completar carga del camión
tareasCtrl.resumenCargaCamion = (req, res) => {
    res.render('tareas/resumenCargaCamion');
};

// Renderiza pantalla de espera para cambio de bahía
tareasCtrl.esperaCambioBahia = (req, res) => {
    res.render('tareas/esperaCambioBahia');
};

// Renderiza vista para escanear pallet a cambiar
tareasCtrl.escanearPalletCambio = (req, res) => {
    res.render('tareas/escanearPalletCambio');
};

// Repetida: pantalla de espera para cambio de bahía (posible redundancia)
tareasCtrl.esperaCambioBahia = (req, res) => {
    res.render('tareas/esperaCambioBahia');
};

// Renderiza pantalla de espera para retiro de pallet
tareasCtrl.esperaPallet = (req, res) => {
    res.render('tareas/esperaPallet');
};

// Almacena una operación de carga de camión
tareasCtrl.guardarCargaCamion = async (req, res) => {
    try {
        const { codigoTarea, cargas, operacionInicio, operacionFin, duracionSegundos, codigoEscaneado, transporte, turno, idUsuario } = req.body;

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

        await nuevaCarga.save(); // Guarda el documento en la base de datos
        res.status(200).json({ message: "Carga guardada correctamente" }); // Devuelve respuesta exitosa
    } catch (error) {
        console.error("Error al guardar la carga:", error); // Muestra error en consola
        res.status(500).json({ message: "Error al guardar la carga" }); // Devuelve error al cliente
    }
};

// Almacena una operación de retiro de pallet
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

        await palletListo.save(); // Guarda el documento
        res.status(200).json({ message: "Carga guardada correctamente" });
    } catch (error) {
        console.error("Error al guardar la carga:", error);
        res.status(500).json({ message: "Error al guardar la carga" });
    }
};

// Almacena una operación de cambio de bahía
tareasCtrl.guardarCambioBahia = async (req, res) => {
    try {
        const { operacionInicio, operacionFin, codigoEscaneado, codigoTarea, palletConfirmado, bahiaInicial, bahiaDestino, transporte, turno, duracionSegundos, idUsuario } = req.body;

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

        await cargaCambiada.save(); // Guarda el documento
        res.status(200).json({ message: "Carga guardada correctamente" });
    } catch (error) {
        console.error("Error al guardar la carga:", error);
        res.status(500).json({ message: "Error al guardar la carga" });
    }
};

// Verifica si un ticket ya fue registrado previamente
tareasCtrl.verificarTicket = async (req, res) => {
    try {
        const { codigoTicket } = req.body;
        const ticketExistente = await CargarCamion.findOne({ codigoTicket: codigoTicket }); // Busca el ticket en la base

        if (ticketExistente) {
            res.status(200).json({ exists: true, message: "El código ya existe" }); // Ticket duplicado
        } else {
            res.status(200).json({ exists: false, message: "El código es válido" }); // Ticket nuevo
        }
    } catch (error) {
        console.error("Error al verificar el ticket:", error); // Error en verificación
        res.status(500).json({ message: "Error en la verificación" });
    }
};

module.exports = tareasCtrl; // Exporta el objeto con todas las funciones del controlador
