const {Schema, model} = require('mongoose');

const TareaSchema = new Schema({
    idTarea: { type: Number, required: true, unique: true },
    operacionInicio: { type: Date, /*required: true*/ },
    operacionFin: { type: Date },
    turno: { type: String },
    duracion: { type: Number }
});

module.exports = model('Tarea', TareaSchema);
