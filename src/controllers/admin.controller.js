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


// Exporta el objeto controlador para usarlo en rutas u otras partes de la aplicación
module.exports = adminCtrl;