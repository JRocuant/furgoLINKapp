
require('dotenv').config(); //Para leer archivo punto env y crear variables de entorno

const app = require('./server');
require('./database');

app.listen(app.get('port'), () =>{
    console.log('Server on port: ', app.get('port'))
})