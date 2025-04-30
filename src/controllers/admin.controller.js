const adminCtrl = {}; // Objeto controlador para funciones del panel de administración

// Modelos requeridos para acceder a la base de datos
const CargarCamion = require('../models/CargarCamion'); // Modelo de operaciones de carga de camiones
const CambioBahia = require('../models/CambioBahia'); // Modelo de cambios de bahía
const RetirarPallet = require('../models/RetirarPallet'); // Modelo de retiro de pallets
const User = require('../models/User'); // Modelo de usuarios

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
    try {
        // Consultar todas las actividades
        const cargar = await CargarCamion.find().lean();
        const cambiar = await CambioBahia.find().lean();
        const retirar = await RetirarPallet.find().lean();

        // Contar operaciones por tipo
        const totalOperaciones = {
            cargar: cargar.length,
            cambiar: cambiar.length,
            retirar: retirar.length,
        };

        // Calcular duración total por tipo
        const totalDuraciones = {
            cargar: cargar.reduce((acc, r) => acc + parseDuration(r.duracion), 0),
            cambiar: cambiar.reduce((acc, r) => acc + parseDuration(r.duracion), 0),
            retirar: retirar.reduce((acc, r) => acc + parseDuration(r.duracion), 0),
        };

        // Extraer turnos por tipo de operación
        const turnos = {
            cargar: cargar.map(r => r.turno),
            cambiar: cambiar.map(r => r.turno),
            retirar: retirar.map(r => r.turno),
        };

        // Función para determinar el turno más frecuente
        const turnoMasFrecuente = (arr) => {
            const contador = {}; // Contador de ocurrencias
            arr.forEach(t => {
                if (!contador[t]) contador[t] = 0;
                contador[t]++;
            });
            return Object.entries(contador).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Sin turno'; // Ordenar por frecuencia
        };

        // Unificar todas las actividades para análisis global
        const todasActividades = [...cargar, ...cambiar, ...retirar];
        const tiemposPorTurno = {}; // Acumulador de tiempos por turno
        const actividadesFrecuencia = { cargar: 0, cambiar: 0, retirar: 0 }; // Conteo de cada tipo
        const tiemposPorActividad = { cargar: 0, cambiar: 0, retirar: 0 }; // Tiempo acumulado por tipo

        // Agrupar tiempos por turno
        todasActividades.forEach(a => {
            const dur = parseDuration(a.duracion);
            const t = a.turno || 'Sin turno';
            if (!tiemposPorTurno[t]) tiemposPorTurno[t] = [];
            tiemposPorTurno[t].push(dur);
        });

        // Calcular promedios por turno
        const turnosPromedios = Object.entries(tiemposPorTurno).map(([turno, tiempos]) => ({
            turno,
            promedio: tiempos.reduce((a, b) => a + b, 0) / tiempos.length
        }));

        // Determinar turno más rápido y más lento
        const turnoRapidoRaw = turnosPromedios.sort((a, b) => a.promedio - b.promedio)[0];
        const turnoLentoRaw = turnosPromedios.sort((a, b) => b.promedio - a.promedio)[0];

        // Formatear resultados
        const turnoRapido = {
            turno: turnoRapidoRaw.turno,
            promedio: formatSecondsToHHMMSS(Math.round(turnoRapidoRaw.promedio))
        };

        const turnoLento = {
            turno: turnoLentoRaw.turno,
            promedio: formatSecondsToHHMMSS(Math.round(turnoLentoRaw.promedio))
        };

        // Asignar frecuencias de actividades
        actividadesFrecuencia.cargar = totalOperaciones.cargar;
        actividadesFrecuencia.cambiar = totalOperaciones.cambiar;
        actividadesFrecuencia.retirar = totalOperaciones.retirar;

        // Obtener actividad más frecuente
        const actividadFrecuente = Object.entries(actividadesFrecuencia).sort((a, b) => b[1] - a[1])[0];

        // Asignar duraciones por actividad
        tiemposPorActividad.cargar = totalDuraciones.cargar;
        tiemposPorActividad.cambiar = totalDuraciones.cambiar;
        tiemposPorActividad.retirar = totalDuraciones.retirar;

        // Obtener actividad más demandante en tiempo
        const actividadDemandante = Object.entries(tiemposPorActividad).sort((a, b) => b[1] - a[1])[0];

        // Obtener fecha y hora actuales
        const ahora = new Date();
        const fechaActual = ahora.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const horaActual = ahora.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

        // Renderizar vista con todos los datos procesados
        res.render('admin/inicio', {
            totalOperaciones,
            totalDuraciones: {
                cargar: formatSecondsToHHMMSS(totalDuraciones.cargar),
                cambiar: formatSecondsToHHMMSS(totalDuraciones.cambiar),
                retirar: formatSecondsToHHMMSS(totalDuraciones.retirar),
            },
            turnos: {
                cargar: turnoMasFrecuente(turnos.cargar),
                cambiar: turnoMasFrecuente(turnos.cambiar),
                retirar: turnoMasFrecuente(turnos.retirar),
            },
            rendimiento: {
                turnoRapido,
                turnoLento,
                actividadFrecuente,
                actividadDemandante
            },
            fechaActual,
            horaActual
        });

    } catch (error) {
        console.error('Error cargando dashboard:', error); // Log del error
        res.status(500).send('Error cargando datos'); // Enviar error al cliente
    }
};


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


// Renderiza la vista estática de transportes (sin datos dinámicos)
adminCtrl.renderTransportes = (req, res) => {
    res.render('admin/transportes'); // Renderiza la plantilla de transportes
};

// Renderiza la vista administrativa de registros de carga de camión
adminCtrl.renderCargarCamionAdmin = async (req, res) => {
    try {
        const registros = await CargarCamion.find().lean(); // Obtener todos los registros de carga de camión
        const usuarios = await User.find({}, 'id name').lean(); // Obtener usuarios (solo id y nombre)

        const mapaUsuarios = {}; // Objeto para mapear ID de usuario a su nombre
        usuarios.forEach(usuario => {
            mapaUsuarios[usuario.id] = usuario.name; // Crear mapeo id => nombre
        });

        const registrosConNombre = registros.map(registro => { // Procesar cada registro
            let listaCargas = []; // Lista de cargas parseada
            try {
                listaCargas = JSON.parse(registro.cargas); // Intentar parsear como JSON
            } catch (e) {
                listaCargas = registro.cargas.split(',').map(c => c.trim()); // Fallback: dividir por comas
            }
            return {
                ...registro, // Copiar todos los datos originales del registro
                nombreUsuario: mapaUsuarios[registro.idUsuario] || 'Desconocido', // Añadir nombre de usuario
                listaCargas // Añadir la lista parseada
            };
        });

        res.render('admin/cargarCamionAdmin', { registros: registrosConNombre }); // Renderizar la vista con los registros procesados

    } catch (error) {
        console.error('Error cargando registros:', error); // Log de error en consola
        res.status(500).send('Error cargando datos'); // Enviar error al cliente
    }
};

// Renderiza la vista administrativa de registros de retiro de pallets
adminCtrl.renderRetirarPalletAdmin = async (req, res) => {
    try {
        const registros = await RetirarPallet.find().lean(); // Obtener todos los registros de retiro
        const usuarios = await User.find({}, 'id name').lean(); // Obtener usuarios (solo id y nombre)
        
        const mapaUsuarios = {}; // Mapa para asociar id con nombre
        usuarios.forEach(usuario => {
            mapaUsuarios[usuario.id] = usuario.name; // Llenar el mapa
        });

        const registrosConNombre = registros.map(registro => ({ // Asociar nombre al registro
            ...registro, // Datos originales
            nombreUsuario: mapaUsuarios[registro.idUsuario] || 'Desconocido' // Nombre asociado
        }));

        res.render('admin/retirarPalletAdmin', { registros: registrosConNombre }); // Renderizar con datos

    } catch (error) {
        console.error('Error cargando registros de retiro de pallets:', error); // Log de error
        res.status(500).send('Error al cargar los datos'); // Enviar error
    }
};

// Renderiza la vista administrativa de registros de cambio entre bahías
adminCtrl.renderCambioEntreBahiasAdmin = async (req, res) => {
    try {
        const registros = await CambioBahia.find().lean(); // Obtener todos los registros de cambio de bahía
        const usuarios = await User.find({}, 'id name').lean(); // Obtener usuarios (id y nombre)

        const mapaUsuarios = {}; // Mapeo de ID a nombre
        usuarios.forEach(usuario => {
            mapaUsuarios[usuario.id] = usuario.name; // Crear mapeo
        });

        const registrosConNombre = registros.map(registro => ({ // Agregar nombre de usuario a los registros
            ...registro,
            nombreUsuario: mapaUsuarios[registro.idUsuario] || 'Desconocido'
        }));

        res.render('admin/cambioEntreBahiasAdmin', { registros: registrosConNombre }); // Renderizar la vista con los datos

    } catch (error) {
        console.error('Error cargando registros de cambio entre bahías:', error); // Log de error
        res.status(500).send('Error cargando datos'); // Enviar error al cliente
    }
};

// Renderiza la vista de monitoreo en tiempo real
adminCtrl.renderTiempoReal = (req, res) => {
    res.render('admin/tiempoReal'); // Renderiza plantilla correspondiente a tiempo real
};

// Exporta el objeto controlador para usarlo en rutas u otras partes de la aplicación
module.exports = adminCtrl;