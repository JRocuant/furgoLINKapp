const { text } = require("express");

const usersCtrl = {};

const passport = require('passport');

const User =require('../models/User')

usersCtrl.renderSignUpForm = (req, res) => {
    res.render('users/signup');
};

usersCtrl.signup = async (req, res) => {
    console.log(req.body)
    const errors = [];
    const {name, email, password, confirm_password} = req.body;
    if (password != confirm_password) {
        errors.push({text: 'Las Contraseñas no coinciden'});//alerta falsh error confirm_password
    }
    if (password.length < 4) {
        errors.push({text: 'La contraseña debe tener al menos 4 caracteres'});//alerta falsh error password demasiado corta
    }
    if (errors.length > 0){
        res.render('users/signup', {
            errors,
            name,
            email
        })
    } else {
        const emailUser = await User.findOne({email: email});
        if (emailUser) {
            req.flash('error_msg', 'Este correo electronico ya se encuentra en uso.');
            res.redirect('/users/signup');
        } else {
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encriptarPassword(password)
            await newUser.save();
            //req.flash('success_msg', 'Registro exitoso');
            res.redirect('/users/signin');
        }
    }
};

usersCtrl.renderSigninForm = (req, res) => {
    res.render('users/signin');
};



usersCtrl.signin = (req, res, next) => {  
    passport.authenticate('local', {  // Usa Passport para autenticar con la estrategia 'local'.
        failureRedirect: '/users/signin',  // Redirige si la autenticación falla.
        failureFlash: true  // Habilita mensajes flash en caso de error.
    }, (err, user, info) => {  // Callback después de la autenticación.
        if (err) return next(err);  // Maneja errores.
        if (!user) return res.redirect('/users/signin');  // Redirige si no hay usuario autenticado.

        req.logIn(user, (err) => {  // Inicia sesión manualmente.
            if (err) return next(err);  // Maneja errores al iniciar sesión.
            console.log(user);
            const { name, email, _id } = user;  // Extrae nombre y correo del usuario.
            res.render('users/postlogin', { name, email, id: _id });  // Muestra la vista postlogin con los datos del usuario.
        });
    })(req, res, next);  // Llama al callback de Passport.
};

/*
- - - TESTEAR DESDE CONSOLA - - -
const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
console.log(usuario); 
*/



usersCtrl.logout = (req, res) => {
    res.send('logout');
}

usersCtrl.olvido = (req, res) => {
    res.render('users/olvido');
}
module.exports = usersCtrl;