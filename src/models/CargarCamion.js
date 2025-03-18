const {Schema, model} = require('mongoose');

const CargarCamionSchema = new Schema({
    operacionInicio: { type: Date },
    operacionFin: { type: Date },
    codigoTicket: { type: String },
    turno: { type: String },
    codigoTarea: { type: String },
    cargas: { type: String },
    transporte: { type: Number },
    duracion: { type: String }
}, {
    timestamps: true
});

module.exports = model('CargarCamion', CargarCamionSchema);