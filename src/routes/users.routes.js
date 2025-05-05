const { Router } = require('express'); // Importa Router desde Express
const router = Router(); // Crea una instancia de Router

// Importa múltiples funciones controladoras desde el archivo users.controller
const { 
    renderSignUpForm,                                            
    renderSigninForm,                                            
    signup,                                                      
    signin,                                                      
    logout,                                                      
    olvido                                                       
} = require('../controllers/users.controller')                   

router.get('/users/signup', renderSignUpForm); // Ruta para formulario de registro
router.post('/users/signup', signup); // Ruta para crear un nuevo usuario

router.get('/users/signin', renderSigninForm); // Ruta para formulario de login
router.post('/users/signin', signin); // Ruta para iniciar sesión

router.get('/users/logout', logout); // Ruta para cerrar sesión

router.get('/users/olvido', olvido); // Ruta para recuperación de contraseña

module.exports = router; // Exporta el router para ser usado en la configuración principal del servidor
