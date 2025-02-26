require('dotenv').config(); //leer archivo .env y asignar los valores a las variables de entorno (crear variables de entorno)
const app = require('./server');
require('./database');



console.log('--------------Valor de app:', app);

app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto:', app.get('port'));
});

