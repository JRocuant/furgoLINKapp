const {Schema, model} = require('mongoose');

const CargarCamionSchema = new Schema({
    operacionInicio: { type: Date },
    operacionFin: { type: Date },
    turno: { type: String },
    codigoTarea: { type: String },
    bahiaCarga: { type: String },
    cargas: { type: String },
    idCamion: { type: Number },
    duracion: { type: Number }
}, {
    timestamps: true
});

module.exports = model('CargarCamion', CargarCamionSchema);