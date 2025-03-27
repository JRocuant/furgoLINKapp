const { text } = require("express");

const usersCtrl = {};

const passport = require('passport');

const User =require('../models/User')

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

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
    passport.authenticate('local', {  
        failureRedirect: '/users/signin',
        failureFlash: true  
    }, (err, user, info) => {  
        if (err) return next(err);
        if (!user) return res.redirect('/users/signin');

        req.logIn(user, (err) => {  
            if (err) return next(err);
            console.log(user);

            const { name, email, _id } = user;  
            const transportes = {};
            const palletMaximo = {};
            let headers = [];

            fs.createReadStream(path.resolve(__dirname, '..', 'public', 'datos', 'RP2.csv'))
                .pipe(csv({ separator: ',' }))
                .on('headers', (headerRow) => {
                    headers = headerRow;
                })
                .on('data', (data) => {
                    const transporte = data[headers[0]];
                    const pallet = parseInt(data[headers[1]], 10);

                    if (isNaN(pallet)) {
                        console.warn(`Valor de pallet no válido: ${data[headers[1]]}`);
                        return;
                    }

                    if (!transportes[transporte]) {
                        transportes[transporte] = new Set();
                    }

                    transportes[transporte].add(pallet);
                })
                .on('end', () => {
                    for (const transporte in transportes) {
                        transportes[transporte] = Array.from(transportes[transporte]);
                        palletMaximo[transporte] = Math.max(...transportes[transporte]);
                    }

                    // Asegurarse de que los datos han sido procesados antes de renderizar
                    res.render('users/postlogin', { 
                        name, 
                        email, 
                        id: _id, 
                        transportes: JSON.stringify(transportes),
                        palletMaximo: JSON.stringify(palletMaximo) 
                    });
                })
                .on('error', (err) => {
                    console.error('Error al procesar el archivo CSV:', err.message);
                    res.status(500).send('Error al procesar el archivo CSV');
                });
        });
    })(req, res, next);
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