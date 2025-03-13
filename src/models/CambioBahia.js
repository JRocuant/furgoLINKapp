const {Schema, model} = require('mongoose');

const CambioBahiaSchema = new Schema({
    //nombreTarea: { type: String, required: true },
    idTarea: { type: Number },
    operacionInicio: { type: Date },
    operacionFin: { type: Date },
    turno: { type: String },
    codigoTarea: { type: String },
    bahiaInicio: { type: Number },
    bahiaFinal: { type: Number },
    idCamion: { type: Number },
    duracion: { type: Number }
    
}, {
    timestamps: true
});

module.exports = model('CambioBahia', CambioBahiaSchema);