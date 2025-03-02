const express = require('express'); //Importar express modulo de integración (Para el motor de plantillas Handlebars .hbs)
const {engine} = require('express-handlebars'); //Motor de plantillas para las vistas html en modulos .hbs
const path = require('path'); //Importar rutas (para el acceso entre elementos)
//Inicializaciones
const app = express();

//Configuración
app.set('port', process.env.PORT || 4000); //Establecer puerto (Si no hay uno designado como PORT utilizar el puerto 4000)
app.set('views', path.join(__dirname, 'views')); //Establecer path para las vistas
app.engine('.hbs',engine({
    defaultLayout: 'main', //Layout Preddeterminado es main.hbs
    layoutsDir: path.join(app.get('views'), 'layouts'), //Carpeta para los layouts
    partialsDir: path.join(app.get('views'), 'partials'), //Carpeta para los partials (modulos de html)
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({extended: false})); //Utilizar express para traducir a JSON

//Rutas
app.get('/',(req,res) => {
    res.render('index');
});

//Variables Globales

//Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')))

module.exports = app;