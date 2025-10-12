const { text } = require("express"); // Importa 'text' desde express, aunque no se utiliza en este archivo

const usersCtrl = {}; // Objeto controlador donde se almacenan las funciones relacionadas a los usuarios

const passport = require('passport');  // Importa Passport para la autenticación

const User = require('../models/User') // Modelo de usuario para interactuar con la base de datos

const fs = require('fs');  // Módulo para manipulación de archivos
const path = require('path'); // Módulo para manejar rutas de archivos
const csv = require('csv-parser'); // Módulo para analizar archivos CSV

usersCtrl.renderSignUpForm = (req, res) => { // Muestra el formulario de registro
    res.render('users/signup'); // Renderiza la vista signup
};

usersCtrl.signup = async (req, res) => { // Controlador para registrar nuevos usuarios
    console.log(req.body) // Muestra los datos recibidos del formulario en consola
    const errors = []; // Inicializa array para almacenar errores de validación
    const {name, email, password, confirm_password, rol} = req.body; // Extrae datos del cuerpo de la solicitud

    if (password != confirm_password) { // Verifica que las contraseñas coincidan
        errors.push({text: 'Las Contraseñas no coinciden'}); // Agrega error si no coinciden
    }
    if (password.length < 10) { // Verifica que la contraseña tenga al menos 4 caracteres
        errors.push({text: 'La contraseña debe tener al menos 10 caracteres'});  // Agrega error si es muy corta
    }

    if (errors.length > 0){ // Si hay errores, renderiza nuevamente el formulario con los mensajes
        res.render('users/signup', {
            errors,
            name,
            email
        })
    } else { // Si no hay errores
        const emailUser = await User.findOne({email: email}); // Verifica si el email ya está registrado
        if (emailUser) {
            req.flash('error_msg', 'Este correo electronico ya se encuentra en uso.'); // Muestra mensaje si ya está en uso
            res.redirect('/users/signup');              // Redirige al formulario de registro
        } else {
            const newUser = new User({name, email, password, rol});  // Crea nuevo usuario
            newUser.password = await newUser.encriptarPassword(password) // Encripta la contraseña
            await newUser.save();                       // Guarda el usuario en la base de datos
            res.redirect('/');                          // Redirige al inicio
        }
    }
};

usersCtrl.renderSignUpForm_apoderado = (req, res) => { // Muestra el formulario de registro
    res.render('users/signup_apoderado'); // Renderiza la vista signup
};

usersCtrl.signup_apoderado = async (req, res) => {
    console.log(req.body);
    const errors = [];
    const {
        name,
        lastName,
        email,
        rol,
        password,
        confirm_password,
        colegio,
        pasajeroName,
        pasajeroLastName
    } = req.body;

    // Validaciones básicas
    if (password !== confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }
    if (password.length < 10) {
        errors.push({ text: 'La contraseña debe tener al menos 10 caracteres' });
    }

    // Validación avanzada (opcional)
    const passwordcheck = (password) => {
        const minuscula = /[a-z]/.test(password);
        const mayuscula = /[A-Z]/.test(password);
        const numero = /[0-9]/.test(password);
        const simbolo = /[^a-zA-Z0-9]/.test(password);
        return minuscula && mayuscula && numero && simbolo;
    };

    if (!passwordcheck(password)) {
        errors.push({ text: 'La contraseña debe incluir mayúsculas, minúsculas, números y símbolos.' });
    }

    // Si hay errores → mostrar formulario
    if (errors.length > 0) {
        return res.render('users/signup_apoderado', {
            errors,
            name,
            email
        });
    }

    // Verifica si el correo ya existe
    const emailUser = await User.findOne({ email });
    if (emailUser) {
        req.flash('error_msg', 'Este correo electrónico ya se encuentra en uso.');
        return res.redirect('/users/signup_apoderado');
    }

    // Crea el nuevo usuario/apoderado
    const newUser = new User({
        name,
        lastName,
        email,
        rol,
        colegio,
        pasajeroName,
        pasajeroLastName
    });
    newUser.password = await newUser.encriptarPassword(password);
    await newUser.save();

    // Redirige al inicio
    return res.redirect('/');
};

// Muestra el formulario de inicio de sesión
usersCtrl.renderSigninForm = (req, res) => { 
    res.render('users/signin');       
};

// Controlador para el inicio de sesión
// Controlador para el inicio de sesión
usersCtrl.signin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err); // Si hay error, lo pasa al middleware de error

        if (!user) { // Si el usuario no existe o es inválido
            req.flash('error_msg', info.message); // Muestra mensaje de error
            return res.redirect('/'); // Redirige al inicio
        }

        // Si la autenticación es exitosa, inicia sesión
        req.logIn(user, (err) => {
            if (err) return next(err);

            console.log(user); // Muestra el usuario autenticado

            const { name, email, _id, rol } = user; // Extrae datos del usuario

            // Renderiza la vista post-login para cualquier rol
            res.render('users/postlogin', {
                name,
                email,
                id: _id,
                rol
            });
        });
    })(req, res, next); // Se debe invocar passport.authenticate
};


/*
- - - TESTEAR DESDE CONSOLA - - -
const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
console.log(usuario); 
*/

// Controlador para cerrar sesión
usersCtrl.logout = (req, res) => {   
    res.send('logout');                 
}

// Muestra la vista de recuperación de contraseña
usersCtrl.olvido = (req, res) => {                      
    res.render('users/olvido');                         
}

// Exporta el controlador para usarlo en otras partes del proyecto
module.exports = usersCtrl;                             
