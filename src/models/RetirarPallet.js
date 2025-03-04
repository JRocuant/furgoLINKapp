const {Schema, model} = require('mongoose');

const RetirarPalletSchema = new Schema({
    //nombreTarea: { type: String, required: true },
    codigoTarea: { type: Number, required: true, unique: true },
    bahiaCarga: { type: Number, required: true },
    codigoTicket: { type: Number, required: true },
    idCamion: { type: Number, required: true },
});

module.exports = model('RetirarPallet', RetirarPalletSchema);


