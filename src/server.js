const express = require('express');
const path = require('path');
const {engine} = require('express-handlebars');

//Inicialización
const app = express();

//Configuración
app.set('port', process.env.PORT || 4000); //Utilizar el puerto predeterminado de la conexión, si no utilizar el puerto 4000
app.set('views', path.join(__dirname, 'views')); //Establecer ubicación carpeta views
app.engine('.hbs', engine({
    defalutLayout: 'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));

app.set('view engine', '.hbs');

//Midlewares (Funciones en respuesta a peticiones)
app.use(express.urlencoded({extended:false})); //Cuando lleguen datos al servidor se deben convertir a JSON

//Variables Globales

//Rutas
app.use(require('./routes/index.routes'));
/*app.get('/', (req,res) =>{
    res.render('index') //Respuesta predeterminada para una request
})*/

//Archivos Estaticos
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;
