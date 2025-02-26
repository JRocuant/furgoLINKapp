const { Schema, model } = require('mongoose');

const operationSchema = new Schema({
    operacionInicio: { type: Date, required: true },//Fecha y hora primer check
    operacionFin: { type: Date, required: true }, //Fecha y hora ultimo check
    codigoTarea: { type: Number, required: true }, //Codigo identificación tarea realizada
    nombreTarea: { type: String, required: true }, //Nombre de la tarea
    idOperador: { type: Number, required: true },//Codigo identificación operador
    nombreOperador: { type: String, required: true },
    codigoTicketCarga: { type: Number, required: true }, //Codigo identificación ticket carga
    bahiaCarga: { type: Number, required: true }, //Codigo identificación (número) bahía de carga
    duracion: { type: Number, default: function(){ 
        return this.operacionFin ? (this.operacionFin - this.operacionInicio) / 1000 : 0;  //Tiempo total de la tarea (Duración en segundos)
    }},
    createdAt: { type: Date, default: Date.now }
}/*,{
    timestamps: true //alternativa para obtener tiempos de manera automatica pero no posee un control tan directo
}*/);

module.exports = model('Operation', operationSchema);


//FORMATOS DE TIEMPO
/* {
  "tiempoInicio": "2025-02-26T10:00:00.000Z",
  "tiempoFin": "2025-02-26T10:05:00.000Z",
  "createdAt": "2025-02-26T15:30:00.000Z"
}*/