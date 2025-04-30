// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los botones que representan tareas, identificados por la clase 'task-btn'
    const taskButtons = document.querySelectorAll('.task-btn');

    // Función que determina el turno según la hora actual de Chile
    function determinarTurno(fechaISO) {
        const fecha = new Date(fechaISO);
        fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset()); // Ajuste a UTC

        const opciones = {
            timeZone: "America/Santiago",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        };

        const formatoChile = new Intl.DateTimeFormat("es-CL", opciones).formatToParts(fecha);

        // Extrae hora y minutos como enteros para la lógica de turnos
        const hora = parseInt(formatoChile[0].value, 10);
        const minutos = parseInt(formatoChile[2].value, 10);

        console.log(hora);
        console.log(minutos);

        // Lógica para asignar el turno según horario
        if ((hora === 7 && minutos >= 0) || (hora > 7 && hora < 14) || (hora === 14 && minutos < 30)) {
            return "Mañana";
        } else if ((hora === 14 && minutos >= 30) || (hora > 14 && hora < 23)) {
            return "Tarde";
        } else {
            return "Noche";
        }
    }

    // Función que obtiene la fecha y hora actual en formato ISO con zona horaria de Chile
    function obtenerFechaHoraChile() {
        const fechaUTC = new Date();

        const opciones = {
            timeZone: "America/Santiago",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        };

        const formatoChile = new Intl.DateTimeFormat("es-CL", opciones).formatToParts(fechaUTC);

        // Formatea la fecha a una cadena con formato ISO (Z indica UTC, aunque es local de Chile)
        let fechaChileISO = `${formatoChile[4].value}-${formatoChile[2].value}-${formatoChile[0].value}T${formatoChile[6].value}:${formatoChile[8].value}:${formatoChile[10].value}Z`;
        return fechaChileISO;
    }

    // Asigna un evento a cada botón de tarea
    taskButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Obtiene el valor de la tarea seleccionada desde el atributo data-task del botón
            const selectedTask = button.getAttribute('data-task').toLowerCase();

            // Guarda la tarea seleccionada en sessionStorage para su uso inmediato
            sessionStorage.setItem('selectedTask', selectedTask);

            // Recupera el historial de tareas desde localStorage o inicia un nuevo arreglo
            let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || [];

            // Obtiene los datos del usuario actual desde localStorage
            const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
            console.log(usuario.name, usuario.email); // Muestra información del usuario en consola

            // Obtiene la fecha y hora actual en formato Chile ISO
            const fechaChileISO = obtenerFechaHoraChile();
            console.log(fechaChileISO);

            // Crea un nuevo objeto con los datos necesarios
            let nuevaTarea = {
                codigoTarea: selectedTask,
                operacionInicio: fechaChileISO,
                fecha: fechaChileISO,
                turno: determinarTurno(fechaChileISO)
            };

            console.log("Nueva tarea guardada:", nuevaTarea);

            // Agrega la nueva tarea al arreglo existente
            tareaActual.push(nuevaTarea);

            // Guarda el arreglo actualizado en localStorage
            localStorage.setItem('tareaActual', JSON.stringify(tareaActual));

            // Redirige al usuario a la pantalla de espera
            window.location.href = '/tareas/espera';
        });
    });

    // Obtiene el botón de cerrar sesión por su ID
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Limpia tanto sessionStorage como localStorage para cerrar sesión correctamente
            sessionStorage.clear();
            localStorage.clear();
            localStorage.removeItem('tareaActual');

            // Redirige al usuario a la página principal o de inicio de sesión
            window.location.href = '/';
        });
    }
});
