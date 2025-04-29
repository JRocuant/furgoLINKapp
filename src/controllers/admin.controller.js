const adminCtrl = {}; // Objeto controlador para funciones del panel de administración

// Modelos requeridos para acceder a la base de datos
const CargarCamion = require('../models/CargarCamion'); 
const CambioBahia = require('../models/CambioBahia');
const RetirarPallet = require('../models/RetirarPallet');
const User = require('../models/User');

// Función para parsear la duración tipo "0m 3s" a segundos
function parseDuration(durationStr) {
    let minutes = 0, seconds = 0;

    if (!durationStr) return 0;

    const minMatch = durationStr.match(/(\d+)m/);
    const secMatch = durationStr.match(/(\d+)s/);

    if (minMatch) minutes = parseInt(minMatch[1]);
    if (secMatch) seconds = parseInt(secMatch[1]);

    return (minutes * 60) + seconds;
}

// Función para formatear segundos a "HH:MM:SS"
function formatSecondsToHHMMSS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

// Renderiza la vista principal del panel de administración
adminCtrl.renderInicio = (req,res) => {
    res.render('admin/inicio');
};

// NUEVAS FUNCIONES

// Renderiza la vista de administración de usuarios con datos reales
adminCtrl.renderUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find().lean();
        const cargarCamionRaw = await CargarCamion.find().lean();
        const cambioBahiaRaw = await CambioBahia.find().lean();
        const retirarPalletRaw = await RetirarPallet.find().lean();

        // Mapeo de ID a nombre
        const mapaUsuarios = {};
        usuarios.forEach(u => mapaUsuarios[u.id] = u.name);

        // Estructura por usuario
        const usuariosConActividades = usuarios.map(usuario => {
            const actividadesCargar = cargarCamionRaw.filter(r => r.idUsuario === usuario.id);
            const actividadesCambio = cambioBahiaRaw.filter(r => r.idUsuario === usuario.id);
            const actividadesRetirar = retirarPalletRaw.filter(r => r.idUsuario === usuario.id);

            const cantidadCargar = actividadesCargar.length;
            const cantidadCambio = actividadesCambio.length;
            const cantidadRetirar = actividadesRetirar.length;

            const sumarTiempos = (tareas) =>
                tareas.reduce((acc, t) => acc + parseDuration(t.duracion), 0);

            const totalSegundos = sumarTiempos([
                ...actividadesCargar,
                ...actividadesCambio,
                ...actividadesRetirar
            ]);

            const tiempoTotal = formatSecondsToHHMMSS(totalSegundos);

            const fechaUltimaActividad =
                actividadesCargar[0]?.operacionInicio?.toISOString().split('T')[0] ||
                actividadesCambio[0]?.operacionInicio?.toISOString().split('T')[0] ||
                actividadesRetirar[0]?.operacionInicio?.toISOString().split('T')[0] ||
                'Sin fecha';

            return {
                nombre: usuario.name,
                turno: actividadesCargar[0]?.turno || actividadesCambio[0]?.turno || actividadesRetirar[0]?.turno || 'Sin turno',
                actividades: {
                    cargarCamion: cantidadCargar,
                    cambioBahia: cantidadCambio,
                    retirarPallet: cantidadRetirar
                },
                tiempoTotal,
                fechaUltimaActividad,
                estado: 'Conectado'
            };
        });

        // Preparar datos para la segunda tabla (por tarea)
        const mapActividad = (actividad) => ({
            nombreUsuario: mapaUsuarios[actividad.idUsuario] || 'Desconocido',
            duracion: formatSecondsToHHMMSS(parseDuration(actividad.duracion)),
            fecha: actividad.operacionInicio?.toISOString().split('T')[0] || 'Sin fecha',
            turno: actividad.turno || 'Sin turno'
        });

        const tareas = {
            cargarCamion: cargarCamionRaw.map(mapActividad),
            cambioBahia: cambioBahiaRaw.map(mapActividad),
            retirarPallet: retirarPalletRaw.map(mapActividad)
        };

        const ahora = new Date();
        const fechaActual = ahora.toLocaleDateString('es-CL');
        const horaActual = ahora.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

        res.render('admin/usuarios', {
            usuariosConActividades,
            tareas,
            fechaActual,
            horaActual
        });

    } catch (error) {
        console.error('Error cargando usuarios:', error);
        res.status(500).send('Error cargando datos');
    }
};


// Renderiza otras vistas

adminCtrl.renderTransportes = (req,res) => {
    res.render('admin/transportes');
};

adminCtrl.renderCargarCamionAdmin = async (req, res) => {
    try {
        const registros = await CargarCamion.find().lean();
        const usuarios = await User.find({}, 'id name').lean();

        const mapaUsuarios = {};
        usuarios.forEach(usuario => {
            mapaUsuarios[usuario.id] = usuario.name;
        });

        const registrosConNombre = registros.map(registro => {
            let listaCargas = [];
            try {
                listaCargas = JSON.parse(registro.cargas);
            } catch (e) {
                listaCargas = registro.cargas.split(',').map(c => c.trim());
            }
            return {
                ...registro,
                nombreUsuario: mapaUsuarios[registro.idUsuario] || 'Desconocido',
                listaCargas
            };
        });

        res.render('admin/cargarCamionAdmin', { registros: registrosConNombre });

    } catch (error) {
        console.error('Error cargando registros:', error);
        res.status(500).send('Error cargando datos');
    }
};

adminCtrl.renderRetirarPalletAdmin = async (req, res) => {
    try {
        const registros = await RetirarPallet.find().lean();
        const usuarios = await User.find({}, 'id name').lean();
        const mapaUsuarios = {};
        usuarios.forEach(usuario => {
            mapaUsuarios[usuario.id] = usuario.name;
        });

        const registrosConNombre = registros.map(registro => ({
            ...registro,
            nombreUsuario: mapaUsuarios[registro.idUsuario] || 'Desconocido'
        }));

        res.render('admin/retirarPalletAdmin', { registros: registrosConNombre });

    } catch (error) {
        console.error('Error cargando registros de retiro de pallets:', error);
        res.status(500).send('Error al cargar los datos');
    }
};

adminCtrl.renderCambioEntreBahiasAdmin = async (req, res) => {
    try {
        const registros = await CambioBahia.find().lean();
        const usuarios = await User.find({}, 'id name').lean();
        const mapaUsuarios = {};
        usuarios.forEach(usuario => {
            mapaUsuarios[usuario.id] = usuario.name;
        });

        const registrosConNombre = registros.map(registro => ({
            ...registro,
            nombreUsuario: mapaUsuarios[registro.idUsuario] || 'Desconocido'
        }));

        res.render('admin/cambioEntreBahiasAdmin', { registros: registrosConNombre });

    } catch (error) {
        console.error('Error cargando registros de cambio entre bahías:', error);
        res.status(500).send('Error cargando datos');
    }
};

adminCtrl.renderTiempos = (req,res) => {
    res.render('admin/tiempos');
};

module.exports = adminCtrl;
