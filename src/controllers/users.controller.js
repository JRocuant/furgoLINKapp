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
    const {name, email, password, confirm_password, rol} = req.body;
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
            const newUser = new User({name, email, password, rol});
            newUser.password = await newUser.encriptarPassword(password)
            await newUser.save();
            //req.flash('success_msg', 'Registro exitoso');
            res.redirect('/');
        }
    }
};

usersCtrl.renderSigninForm = (req, res) => {
    res.render('users/signin');
};



usersCtrl.signin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash('error_msg', info.message);
            return res.redirect('/');
        }

        req.logIn(user, (err) => {
            if (err) return next(err);
            console.log(user);

            const { name, email, _id, rol } = user;
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

                    // Determinar a qué ruta redirigir según el rol del usuario
                    /*if (rol === 'administrador' || rol === 'jefeDeTurno') {
                        return res.render('users/postloginAdmin', { // Ruta para administrador o jefe de turno
                            name, 
                            email, 
                            id: _id,
                            rol, 
                            transportes: JSON.stringify(transportes),
                            palletMaximo: JSON.stringify(palletMaximo) 
                        }); 
                    } else if (rol === 'operador') {
                        return res.render('users/postlogin', { 
                            name, 
                            email, 
                            id: _id,
                            rol, 
                            transportes: JSON.stringify(transportes),
                            palletMaximo: JSON.stringify(palletMaximo) 
                        }); // Ruta para operador
                    }*/

                    // Si el rol es desconocido, renderizar la vista post-login
                    res.render('users/postlogin', { 
                        name, 
                        email, 
                        id: _id,
                        rol, 
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