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
            req.flash('success_msg', 'Registro exitoso');
            res.redirect('/users/signin');
        }
    }
};

usersCtrl.renderSigninForm = (req, res) => {
    res.render('users/signin');
};

usersCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/users/signin',
    successRedirect: '/tareass',
    failureFlash: true
});


usersCtrl.logout = (req, res) => {
    res.send('logout');
}

module.exports = usersCtrl;