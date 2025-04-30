const { Schema, model } = require('mongoose'); // Importa Schema y model desde Mongoose para definir y exportar modelos de datos

// Define el esquema para registrar operaciones de retiro de pallets en el sistema
const RetirarPalletSchema = new Schema({
    operacionInicio: { type: Date },           // Fecha y hora de inicio de la operación de retiro de pallet
    operacionFin: { type: Date },              // Fecha y hora de finalización de la operación
    codigoTicket: { type: String },            // Código identificador del ticket asociado al retiro
    turno: { type: String },                   // Turno en el que se realizó la operación (mañana, tarde o noche)
    codigoTarea: { type: String },             // Código que identifica el tipo de tarea, por ejemplo "retirar-pallet"
    bahiaCarga: { type: Number },              // Número de la bahía desde la cual se retiró el pallet
    transporte: { type: Number },              // Identificador del transporte al que se retiró el pallet
    duracion: { type: String },                // Duración total de la operación (minutos segundos)
    idUsuario: { type: String }                // ID del usuario que ejecutó la operación (referencia a la colección users)
});

// Exporta el modelo RetirarPallet basado en el esquema definido, permitiendo su uso en consultas a la base de datos
module.exports = model('RetirarPallet', RetirarPalletSchema);
