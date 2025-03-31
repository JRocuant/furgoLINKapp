// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los botones de tareas con la clase 'task-btn'
    const taskButtons = document.querySelectorAll('.task-btn');
    
    function determinarTurno(fechaISO) {
        const fecha = new Date(fechaISO);
        const hora = fecha.getHours();
        const minutos = fecha.getMinutes();

        console.log(hora);
        console.log(minutos);

        if ((hora === 7 && minutos >= 0) || (hora > 7 && hora < 14) || (hora === 14 && minutos < 30)) {
            return "Mañana";
        } else if ((hora === 14 && minutos >= 30) || (hora > 14 && hora < 23)) {
            return "Tarde";
        } else {
            return "Noche";
        }
    }

    function obtenerFechaHoraChile() {
        const fechaUTC = new Date();
        const opciones = { timeZone: "America/Santiago", hour12: false };
        
        // Obtener la fecha y hora en la zona horaria de Chile
        const fechaChile = new Intl.DateTimeFormat("es-CL", {
            ...opciones,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }).format(fechaUTC);

        // Extraer los valores de la fecha usando expresión regular
        const [dia, mes, año, hora, minutos, segundos] = fechaChile.match(/\d+/g);
        const fechaChileISO = `${año}-${mes}-${dia}T${hora}:${minutos}:${segundos}`;

        console.log("Fecha en Chile (ISO):", fechaChileISO);
        return fechaChileISO;
    }

    taskButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Obtiene el valor del atributo 'data-task' del botón presionado
            const selectedTask = button.getAttribute('data-task').toLowerCase();

            // Almacena en sessionStorage para compatibilidad con código existente
            sessionStorage.setItem('selectedTask', selectedTask);

            // Recupera el array desde localStorage o crea uno nuevo si no existe
            let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || [];

            const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
            console.log(usuario.name, usuario.email);

            // Genera la fecha actual en formato ISO considerando la hora de Chile
            const fechaChileISO = obtenerFechaHoraChile();

            console.log(fechaChileISO);
            
            // Crea un nuevo objeto de tarea con el turno calculado
            let nuevaTarea = {
                codigoTarea: selectedTask,
                operacionInicio: fechaChileISO,
                fecha: fechaChileISO,
                turno: determinarTurno(fechaChileISO)
            };

            console.log("Nueva tarea guardada:", nuevaTarea);

            // Agrega la nueva tarea al array
            tareaActual.push(nuevaTarea);

            // Guarda el array actualizado en localStorage
            localStorage.setItem('tareaActual', JSON.stringify(tareaActual));

            // Redirige a la pantalla de espera
            window.location.href = '/tareas/espera';
        });
    });

    // Obtiene el botón de cerrar sesión por su ID
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Limpia sessionStorage y localStorage al cerrar sesión
            sessionStorage.clear();
            localStorage.clear();
            localStorage.removeItem('tareaActual');

            // Redirige al usuario a la página de inicio de sesión
            window.location.href = '/';
        });
    }
});
