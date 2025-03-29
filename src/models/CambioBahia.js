const {Schema, model} = require('mongoose');

const CambioBahiaSchema = new Schema({
    operacionInicio: { type: Date },
    operacionFin: { type: Date },
    turno: { type: String },
    codigoTarea: { type: String },
    palletCambiado: { type: String} ,
    bahiaInicial: { type: String },
    bahiaFinal: { type: String },
    transporte: { type: String },
    duracion: { type: String },
    idUsuario: { type: String }
    
});

module.exports = model('CambioBahia', CambioBahiaSchema);
