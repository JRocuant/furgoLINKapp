const {Schema, model} = require('mongoose');

const CambioBahiaSchema = new Schema({
    nombreTarea: { type: String, required: true },
    codigoTarea: { type: Number, required: true, ref: 'Tarea' },
    bahiaCargaInicio: { type: Number, required: true },
    bahiaCargaFinal: { type: Number, required: true },
    idCamion: { type: Number, required: true }
});

module.exports = model('CambioBahia', CambioBahiaSchema);