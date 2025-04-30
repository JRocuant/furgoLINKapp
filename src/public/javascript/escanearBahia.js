document.addEventListener("DOMContentLoaded", function () { // Espera a que todo el DOM esté cargado antes de ejecutar el código
    const submitCodeBtn = document.getElementById("submitCodeBtn"); // Obtiene el botón para enviar el código
    const codeInput = document.getElementById("codeInput");         // Obtiene el input donde se escribe el código
    const mensaje = document.getElementById("mensaje");             // Obtiene el elemento para mostrar mensajes al usuario

    // Recuperar el array de tareas desde localStorage
    let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || []; // Carga tareas guardadas o crea un array vacío si no hay datos
    console.log("Tareas registradas:", tareaActual);                         // Muestra en consola las tareas recuperadas

    // Si quieres obtener solo los códigos de tarea
    let codigos = tareaActual.map(tarea => tarea.codigoTarea);   // Extrae solo los códigos de tarea del array
    console.log("Códigos de tarea:", codigos);                   // Muestra los códigos en consola

    // Obtiene la última tarea registrada (suponiendo que es la tarea en curso)
    let ultimaTarea = tareaActual[tareaActual.length - 1];       // Selecciona la última tarea del array
    console.log("Última tarea registrada:", ultimaTarea);        // Muestra esa tarea en consola

    // Recuperar datos del usuario, incluyendo el ID
    const usuario = JSON.parse(localStorage.getItem('usuarioActual')); // Carga los datos del usuario guardado
    console.log("Usuario actual:", usuario);                           // Muestra los datos del usuario

    // Función para obtener la hora de Chile en formato ISO
    function obtenerFechaHoraChile() {
        const fechaUTC = new Date(); // Crea una fecha actual en UTC
        const opciones = { 
            timeZone: "America/Santiago",                           // Define la zona horaria de Santiago
            year: "numeric", month: "2-digit", day: "2-digit",      // Define el formato de fecha
            hour: "2-digit", minute: "2-digit", second: "2-digit",  // Define el formato de hora
            hour12: false                                           // Usa formato de 24 horas
        };
        const formatoChile = new Intl.DateTimeFormat("es-CL", opciones).formatToParts(fechaUTC); // Formatea la fecha y hora para Chile
        
        let fechaChileISO = `${formatoChile[4].value}-${formatoChile[2].value}-${formatoChile[0].value}T${formatoChile[6].value}:${formatoChile[8].value}:${formatoChile[10].value}Z`; // Crea un string en formato ISO
        return fechaChileISO; // Retorna la fecha y hora formateada
    }

    // Botón para confirmar código
    submitCodeBtn.addEventListener("click", function () { // Agrega un listener al botón de confirmación
        const bahiaValue = codeInput.value.trim();        // Obtiene y limpia el valor ingresado

        if (bahiaValue !== "") { // Verifica que se ingresó un valor
            // Agrega el código ingresado a la última tarea registrada
            if (tareaActual.length > 0) {
                tareaActual[tareaActual.length - 1].codigoBahia = bahiaValue; // Asigna el código de bahía a la última tarea
            }

            // Guarda el array actualizado en localStorage
            localStorage.setItem('tareaActual', JSON.stringify(tareaActual)); // Guarda los cambios localmente

            // Redirige a la página correspondiente
            const nextPage = '/tareas/seleccion'; // Define la siguiente página

            // Obtener fecha y hora de Chile como operacionFin
            const operacionFin = obtenerFechaHoraChile(); // Obtiene la hora de fin

            // Realiza la llamada al servidor para guardar el pallet listo
            fetch("/tareas/guardarPalletListo", {
                method: "POST", // Método HTTP POST
                headers: { "Content-Type": "application/json" }, // Define tipo de contenido
                body: JSON.stringify({ // Define los datos que se enviarán al servidor
                    codigoTarea: ultimaTarea.codigoTarea,
                    codigoBahia: bahiaValue,
                    operacionInicio: ultimaTarea.operacionInicio,
                    operacionFin: operacionFin,
                    duracionSegundos: calcularDuracion(ultimaTarea.operacionInicio, operacionFin).formatoLegible,
                    codigoEscaneado: ultimaTarea.codigoEscaneado,
                    transporte: ultimaTarea.transporte,
                    turno: ultimaTarea.turno,
                    idUsuario: usuario.id
                })
            })
            .then(response => response.json()) // Convierte la respuesta en JSON
            .then(result => { // Maneja la respuesta del servidor
                console.log(result.message); // Muestra el mensaje en consola
                if (result.message === "Carga guardada correctamente") { // Si se guardó correctamente
                    window.location.href = nextPage; // Redirige al usuario
                } else {
                    mensaje.textContent = " Error al guardar la carga."; // Muestra error en pantalla
                }
            })
            .catch(error => { // Maneja errores de conexión o del servidor
                console.error("Error al enviar la carga:", error); // Muestra error en consola
                mensaje.textContent = " Error al conectar con el servidor."; // Muestra error en pantalla
            });
        } else {
            alert("Por favor, ingrese un código válido."); // Alerta si no se ingresó ningún código
        }
    });

    function calcularDuracion(operacionInicioStr, operacionFinStr) { // Calcula la duración entre dos fechas
        const inicio = new Date(operacionInicioStr); // Convierte inicio a objeto Date
        const fin = new Date(operacionFinStr);       // Convierte fin a objeto Date
        const diferenciaMs = fin - inicio;           // Calcula diferencia en milisegundos
        const diferenciaSegundos = Math.floor(diferenciaMs / 1000); // Convierte a segundos

        const minutos = Math.floor(diferenciaSegundos / 60); // Obtiene los minutos
        const segundos = diferenciaSegundos % 60;            // Obtiene los segundos restantes
        
        return { totalSegundos: diferenciaSegundos,      
                formatoLegible: `${minutos}m ${segundos}s` // Devuelve duración formateada
         };
    }
});
