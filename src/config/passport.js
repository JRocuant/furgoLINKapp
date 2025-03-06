const passport = require('passport'); //Importar Passport
const LocalStrategy = require('passport-local').Strategy; //Especificamente usamos passport local es decir nuestra base de datos

const User = require('../models/User');

passport.use(new LocalStrategy({//Configuración de passport para validar usuarios
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {

    //Comparación email del usuario
    const user = await User.findOne({email})
    if (!user) {
        return done(null, false, {message: 'Usuario no encontrado'})
    } else {
        //Comparación contraseña del usuario
        await user.compararPassword(password);
        if (true) {
            return done(null, user);
        } else {
            return done(null,false, {message: 'Contraseña incorrecta'});
        }
    }
}));

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
