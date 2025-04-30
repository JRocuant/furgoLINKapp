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
    if (password.length < 4) { // Verifica que la contraseña tenga al menos 4 caracteres
        errors.push({text: 'La contraseña debe tener al menos 4 caracteres'});  // Agrega error si es muy corta
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

// Muestra el formulario de inicio de sesión
usersCtrl.renderSigninForm = (req, res) => { 
    res.render('users/signin');       
};

// Controlador para el inicio de sesión
usersCtrl.signin = (req, res, next) => {                
    passport.authenticate('local', (err, user, info) => { // Autenticación 
        if (err) return next(err); // Si hay error, lo pasa al middleware de error
        if (!user) { // Si el usuario no existe o es inválido
            req.flash('error_msg', info.message); // Muestra mensaje de error
            return res.redirect('/'); // Redirige al inicio
        }

        req.logIn(user, (err) => { // Si la autenticación es exitosa, inicia sesión
            if (err) return next(err);
            console.log(user); // Muestra el usuario autenticado

            const { name, email, _id, rol } = user; // Extrae datos del usuario
            const transportes = {}; // Objeto para almacenar transportes y sus pallets
            const palletMaximo = {}; // Objeto para almacenar el pallet máximo por transporte
            let headers = []; // Arreglo para los encabezados del CSV

            fs.createReadStream(path.resolve(__dirname, '..', 'public', 'datos', 'RP2.csv')) // Abre archivo CSV
                .pipe(csv({ separator: ',' })) // Lo procesa como CSV
                .on('headers', (headerRow) => { // Captura los encabezados
                    headers = headerRow;
                })
                .on('data', (data) => { // Procesa cada fila del CSV
                    const transporte = data[headers[0]]; // Obtiene el nombre del transporte
                    const pallet = parseInt(data[headers[1]], 10); // Convierte el valor del pallet a número

                    if (isNaN(pallet)) { // Verifica que el valor sea válido
                        console.warn(`Valor de pallet no válido: ${data[headers[1]]}`); // Muestra advertencia
                        return;
                    }

                    if (!transportes[transporte]) { // Si el transporte no existe, lo inicializa como un Set
                        transportes[transporte] = new Set();
                    }

                    transportes[transporte].add(pallet);  // Agrega el pallet al conjunto del transporte
                })
                .on('end', () => {  // Cuando termina de procesar el CSV
                    for (const transporte in transportes) {
                        transportes[transporte] = Array.from(transportes[transporte]);   // Convierte Set a Array
                        palletMaximo[transporte] = Math.max(...transportes[transporte]); // Obtiene el valor máximo
                    }

                    // Renderiza la vista post-login para cualquier rol
                    res.render('users/postlogin', { 
                        name, 
                        email, 
                        id: _id,
                        rol,
                        // Serializa los datos para enviarlos a la vista 
                        transportes: JSON.stringify(transportes), 
                        palletMaximo: JSON.stringify(palletMaximo) 
                    });
                })
                .on('error', (err) => {  // Captura errores durante la lectura del CSV
                    console.error('Error al procesar el archivo CSV:', err.message);
                    res.status(500).send('Error al procesar el archivo CSV'); // Muestra error al cliente
                });
        });
    })(req, res, next);  // Ejecuta la función de autenticación con los argumentos de Express
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
