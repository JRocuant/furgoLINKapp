require('dotenv').config(); // Para leer archivo .env y cargar las variables de entorno en process.env

const app = require('./server'); // Importa la configuración del servidor desde el archivo server.js
require('./database'); // Establece la conexión con la base de datos, ejecutando el archivo database.js

app.listen(app.get('port'), () =>{ // Inicia el servidor en el puerto especificado previamente en app.set
    console.log('Server on port: ', app.get('port')) // Muestra en consola el puerto en que está corriendo el servidor
})
