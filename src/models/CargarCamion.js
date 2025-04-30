const { Schema, model } = require('mongoose'); // Importa Schema y model desde Mongoose para definir y exportar modelos de datos

// Define el esquema para registrar operaciones de carga de camiones en el sistema
const CargarCamionSchema = new Schema({
    operacionInicio: { type: Date },           // Fecha y hora de inicio de la operación de carga
    operacionFin: { type: Date },              // Fecha y hora de finalización de la operación
    codigoTicket: { type: String },            // Código identificador del primer ticket asociado a la carga
    turno: { type: String },                   // Turno en el que se realizó la operación (mañana, tarde o noche)
    codigoTarea: { type: String },             // Código que identifica el tipo de tarea, por ejemplo "cargar-camión"
    cargas: { type: String },                  // Detalle de las cargas realizadas (puede ser un identificador o descripción)
    transporte: { type: Number },              // Identificador del transporte al que se cargó el material
    duracion: { type: String },                // Duración total de la operación (minutos segundos)
    idUsuario: { type: String }                // ID del usuario que ejecutó la operación (referencia a la colección users)
});

// Exporta el modelo CargarCamion basado en el esquema definido, permitiendo su uso en consultas a la base de datos
module.exports = model('CargarCamion', CargarCamionSchema);
