const passport = require('passport'); // Importar la librería Passport para autenticación
const LocalStrategy = require('passport-local').Strategy; // Importar la estrategia local de Passport

const User = require('../models/User'); // Importar el modelo de usuario

passport.use(new LocalStrategy({ // Configurar estrategia local
    usernameField: 'email', // Usar el campo 'email' como nombre de usuario
    passwordField: 'password' // Usar el campo 'password' como contraseña
}, async (email, password, done) => { // Función callback para autenticación
    try {
        // Buscar usuario por email
        const user = await User.findOne({ email }); // Buscar en la base de datos el usuario con ese email
        if (!user) { // Si no se encuentra el usuario
            return done(null, false, { message: 'Usuario no encontrado' }); // Retornar error de usuario no encontrado
        }

        // Comparar contraseña
        const isMatch = await user.compararPassword(password); // Llamar al método para comparar contraseñas
        if (!isMatch) { // Si las contraseñas no coinciden
            return done(null, false, { message: 'Contraseña incorrecta' }); // Retornar error de contraseña incorrecta
        }

        // Si todo está bien, autenticamos al usuario
        return done(null, user); // Autenticación exitosa, retornar usuario
    } catch (err) {
        return done(err); // En caso de error, pasarlo al middleware
    }
}));

passport.serializeUser((user, done) =>{ // Serializar el usuario para la sesión
    done(null, user.id); // Guardar el ID del usuario en la sesión
});

passport.deserializeUser(async (id, done) => { // Deserializar el usuario desde la sesión
    try {
        const user = await User.findById(id); // Buscar usuario por ID
        done(null, user); // Retornar el usuario completo
    } catch (err) {
        done(err, null); // En caso de error, retornar el error
    }
});
