const express = require('express'); //Importar express modulo de integración (Para el motor de plantillas Handlebars .hbs)
const {engine} = require('express-handlebars'); //Motor de plantillas para las vistas html en modulos .hbs
const path = require('path'); //Importar rutas (para el acceso entre elementos)
const morgan = require('morgan'); //Importar morgan de express para registrar información sobre las solicitudes entrantes
const methodOverride = require('method-override'); //Para poder eliminar y sobreescribir información
const flash = require('connect-flash'); //Para poder relaizar conexiones entre vistas
const session = require('express-session'); //Para poder inicializar la sesion que utilizara connect-flash
const passport = require('passport'); //Para poder inicializar y verificar credenciales

//Inicializaciones
const app = express();
require('./config/passport');

//Configuración
app.set('port', process.env.PORT || 4000); //Establecer puerto (Si no hay uno designado como PORT utilizar el puerto 4000)
app.set('views', path.join(__dirname, 'views')); //Establecer path para las vistas
app.engine('.hbs',engine({
    defaultLayout: 'main', //Layout Preddeterminado es main.hbs
    layoutsDir: path.join(app.get('views'), 'layouts'), //Carpeta para los layouts
    partialsDir: path.join(app.get('views'), 'partials'), //Carpeta para los partials (modulos de html)
    extname: '.hbs',
    helpers: {
        formatDate: function(date) { // Formatea una fecha a formato YYYY-MM-DD
            if (!date) return ''; // Si no hay fecha, retorna cadena vacía
            return new Date(date).toISOString().split('T')[0]; // Convierte a ISO y extrae solo la parte de la fecha
        },
        json: function(context) { // Convierte un objeto o valor a formato JSON
          return JSON.stringify(context); // Retorna el valor convertido a string JSON
        },
        get: function(arr, index) { // Obtiene el elemento en cierta posisción de un arreglo
            return Array.isArray(arr) && arr.length > index ? arr[index] : ''; // Si es un arreglo válido y el índice existe, lo retorna; si no, retorna cadena vacía
        }
    }
    
}));
app.set('view engine', '.hbs'); // Configura Handlebars como motor de plantillas para la aplicación.

// Middlewares
app.use(express.json()); // Middleware para analizar el cuerpo de las solicitudes con formato JSON.
app.use(express.urlencoded({ extended: true })); // Middleware para analizar el cuerpo de las solicitudes con formato URL-encoded.
app.use(morgan('dev')); // Utiliza morgan en modo desarrollo para ver las solicitudes HTTP en la consola.
app.use(express.urlencoded({extended: false})); // Middleware para analizar el cuerpo de las solicitudes con formato URL-encoded.
app.use(methodOverride('_method')); // Middleware que permite sobrecargar el método HTTP usando un campo _method, utilizado en los PUT.
app.use(session({ // Utiliza express-session para gestionar sesiones de usuario.
    secret: 'secret', //Para firmar las sesiones.
    resave: true, // Fuerza la sesión a ser guardada en cada solicitud.
    saveUninitialized: true // Guarda la sesión incluso si no se modificó.
}));
app.use(passport.initialize()); // Inicializa Passport.js para la autenticación de usuarios.
app.use(passport.session()); // Establece la sesión con Passport.js.

app.use(flash()); // Utiliza connect-flash para mostrar mensajes temporales como alertas o notificaciones.

// Variables Globales
app.use((req, res, next) => { 
    res.locals.success_msg = req.flash('success_msg'); // Asigna el mensaje de éxito global a la vista.
    res.locals.error_msg = req.flash('error_msg'); // Asigna el mensaje de error global a la vista.
    res.locals.error = req.flash('error'); // Asigna un mensaje de error general a la vista.
    next(); // Pasa al siguiente middleware.
})

// Rutas
app.use(require('./routes/index.routes'));
app.use(require('./routes/tareas.routes')); 
app.use(require('./routes/users.routes')); 
app.use(require('./routes/admin.routes'));
app.use(require('./routes/apoderado.routes'));

 // Archivos estáticos
app.use(express.static(path.join(__dirname, 'public'))) // Sirve archivos estáticos desde la carpeta public.

module.exports = app; // Exportación para que sea utilizada en otro archivo.
