const { Schema, model } = require('mongoose'); // Importa Schema y model desde Mongoose para definir y exportar modelos de datos

// Define el esquema para registrar operaciones de cambio de bahía en el sistema
const CambioBahiaSchema = new Schema({
    operacionInicio: { type: Date },           // Fecha y hora de inicio de la operación de cambio de bahía
    operacionFin: { type: Date },              // Fecha y hora de finalización de la operación
    turno: { type: String },                   // Turno en el que se realizó la operación (mañana, tarde o noche)
    codigoTarea: { type: String },             // "cambio-entre-bahías"
    palletCambiado: { type: String },          // Identificador del pallet que fue movido
    bahiaInicial: { type: Number },            // Número de la bahía de origen
    bahiaFinal: { type: Number },              // Número de la bahía de destino
    transporte: { type: Number },              // Identificador del transporte asociado a la operación
    duracion: { type: String },                // Duración total de la operación (minutos segundos)
    idUsuario: { type: String }                // ID del usuario que ejecutó la operación (referencia a la colección users)
});

// Exporta el modelo CambioBahia basado en el esquema definido, permitiendo su uso en consultas a la base de datos
module.exports = model('CambioBahia', CambioBahiaSchema);
