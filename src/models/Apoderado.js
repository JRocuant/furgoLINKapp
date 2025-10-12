const { Schema, model } = require('mongoose');     // Importa Schema y model desde Mongoose para definir y exportar modelos de datos
const bcrypt = require('bcryptjs');                // Importa bcryptjs para gestionar el hash de contraseñas

// Define el esquema de usuarios que acceden al sistema
const UserSchema = new Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },                     // Nombre del usuario (campo obligatorio)
    email: { type: String, required: true, unique: true },      // Correo electrónico del usuario
    rol: { type: String, required: true },
    pasajeroName: { type: String, required: true },
    pasajeroLastName: { type: String, required: true },
    colegio: { type: String, required: true },                     // Rol del usuario dentro del sistema
    password: { type: String, required: true },                 // Contraseña del usuario (campo obligatorio)
    id: { type: String }                                        // Campo adicional que almacena el _id como string para facilitar su uso
}, {
    timestamps: true                                            // Agrega automáticamente campos createdAt y updatedAt al documento
});

// Hook pre-save para asignar el _id como string al campo id solo al crear un nuevo documento
UserSchema.pre('save', function(next) {
    if (this.isNew) {                                // Verifica si el documento es nuevo
        this.id = this._id.toString();               // Convierte el _id (ObjectId) a string y lo guarda en el campo id
    }
    next();                                          // Continúa con el guardado
});

// Método de instancia para encriptar la contraseña antes de guardarla
UserSchema.methods.encriptarPassword = async password => {
    const salt = await bcrypt.genSalt(10);           // Genera un salt para el hash
    return await bcrypt.hash(password, salt);        // Devuelve la contraseña encriptada con bcrypt
};

// Método de instancia para comparar una contraseña ingresada con la almacenada
UserSchema.methods.compararPassword = async function(password) {
    return await bcrypt.compare(password, this.password); // Compara la contraseña en texto plano con el hash almacenado
};

// Exporta el modelo User basado en el esquema definido, permitiendo su uso en autenticación y administración de usuarios
module.exports = model('Apoderado', UserSchema);
