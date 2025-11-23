const adminCtrl = {}; // Objeto controlador para funciones del panel de administración

// Modelos requeridos para acceder a la base de datos
const User = require('../models/User'); // Modelo de usuarios

//FUNCIONES DE TIEMPO NQUE UTILIZAREMOS EN SIGUIENTES SPRINTS

// Función para parsear la duración tipo "0m 3s" a segundos
function parseDuration(durationStr) {
    let minutes = 0, seconds = 0; // Inicializar valores

    if (!durationStr) return 0; // Si no hay duración, devolver 0

    const minMatch = durationStr.match(/(\d+)m/); // Buscar minutos
    const secMatch = durationStr.match(/(\d+)s/); // Buscar segundos

    if (minMatch) minutes = parseInt(minMatch[1]); // Extraer minutos si existen
    if (secMatch) seconds = parseInt(secMatch[1]); // Extraer segundos si existen

    return (minutes * 60) + seconds; // Calcular total en segundos
}

// Función para formatear segundos a "HH:MM:SS"
function formatSecondsToHHMMSS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600); // Calcular horas
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Calcular minutos restantes
    const seconds = totalSeconds % 60; // Calcular segundos restantes

    // Formatear con ceros a la izquierda si es necesario
    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

// Renderiza la vista principal del panel de administración
adminCtrl.renderInicio = async (req, res) => {
    res.render('admin/inicio');
};

// LISTAR USUARIOS
adminCtrl.listUsers = async (req, res) => {  
    try {
        // Busca todos los usuarios en la base de datos usando el modelo User
        // .find() obtiene todos los documentos
        // .lean() convierte los resultados a objetos JavaScript simples (más livianos)
        const users = await User.find().lean(); 

        // Renderiza la vista "admin/list" y le pasa la lista de usuarios
        res.render("admin/list", { users });

    } catch (error) {
        // Muestra el error en consola si ocurre un problema
        console.error(error);

        // Envía un mensaje simple al navegador indicando que hubo un error
        res.send("Error al obtener usuarios");
    }
};

// ELIMINAR USUARIO
adminCtrl.deleteUser = async (req, res) => {
    try {
        // Extrae el id del usuario desde los parámetros de la URL (/admin/delete/:id)
        const { id } = req.params;

        // Elimina el usuario que coincide con el id
        await User.findByIdAndDelete(id);

        // Redirige nuevamente al listado de usuarios después de eliminar
        res.redirect("/admin/list");

    } catch (error) {
        // Muestra en consola el error en caso de fallar el borrado
        console.error(error);

        // Envía un mensaje simple al navegador indicando el fallo
        res.send("Error al eliminar usuario");
    }
};


// Exporta el objeto controlador para usarlo en rutas u otras partes de la aplicación
module.exports = adminCtrl;