const {Schema, model} = require('mongoose');

const CargarCamionSchema = new Schema({
    operacionInicio: { type: Date },
    operacionFin: { type: Date },
    turno: { type: String },
    codigoTarea: { type: String },
    cargas: { type: String },
    idCamion: { type: String },
    duracion: { type: String }
}, {
    timestamps: true
});

module.exports = model('CargarCamion', CargarCamionSchema);