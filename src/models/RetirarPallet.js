const {Schema, model} = require('mongoose');

const RetirarPalletSchema = new Schema({
    //nombreTarea: { type: String, required: true },
    idTarea: { type: Number },
    operacionInicio: { type: Date },
    operacionFin: { type: Date },
    turno: { type: String },
    codigoTarea: { type: String },
    bahiaCarga: { type: Number },
    codigoTicket: { type: Number },
    idCamion: { type: Number },
    duracion: { type: Number }
    
}, {
    timestamps: true
});

module.exports = model('RetirarPallet', RetirarPalletSchema);


