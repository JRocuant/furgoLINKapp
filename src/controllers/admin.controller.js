const adminCtrl = {};

const CargarCamion = require('../models/CargarCamion'); // Ajusta la ruta si es necesario

const User = require('../models/User');

adminCtrl.renderInicio = (req,res) => {
    res.render('admin/inicio');
};

//NUEVO DESDE ACÁ
adminCtrl.renderUsuarios = (req,res) => {
    res.render('admin/usuarios');
};

adminCtrl.renderTransportes = (req,res) => {
    res.render('admin/transportes');
};

adminCtrl.renderCargarcamionadm = async (req, res) => {
    try {
        const registros = await CargarCamion.find().lean();

        // Buscar los nombres de usuarios vinculados
        const usuarios = await User.find({}, 'id name').lean();

        // Crear un mapa de id -> name para acceso rápido
        const mapaUsuarios = {};
        usuarios.forEach(usuario => {
            mapaUsuarios[usuario.id] = usuario.name;
        });

        // Reemplazar idUsuario con nombre y Parsear cargar para el menu desplegable
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

        res.render('admin/cargarcamionadm', { registros: registrosConNombre });

    } catch (error) {
        console.error('Error cargando registros:', error);
        res.status(500).send('Error cargando datos');
    }
};


adminCtrl.renderRetirarpalletadm = (req,res) => {
    res.render('admin/retirarpalletadm');
};

adminCtrl.renderCambioentrebahiasadm = (req,res) => {
    res.render('admin/cambioentrebahiasadm');
};

adminCtrl.renderTiempos = (req,res) => {
    res.render('admin/tiempos');
};


module.exports = adminCtrl;
