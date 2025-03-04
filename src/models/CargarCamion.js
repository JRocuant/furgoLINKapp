const {Schema, model} = require('mongoose');

const CargarCamionSchema = new Schema({
    //nombreTarea: { type: String, required: true },
    codigoTarea: { type: Number, required: true, ref: 'Tarea' },
    bahiaCarga: { type: Number, required: true },
    codigoTicketCargas: { type: Number, required: true },
    idCamion: { type: Number, required: true }
});

module.exports = model('CargarCamion', CargarCamionSchema);