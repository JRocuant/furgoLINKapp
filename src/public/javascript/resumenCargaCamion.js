// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {
    // Obtiene la lista de pallets almacenados en sessionStorage y los convierte en un array
    const pallets = JSON.parse(sessionStorage.getItem("palletsCargados")) || [];

    // Obtiene los elementos del DOM
    const resumenList = document.getElementById("resumenList"); // Lista donde se mostrarán los pallets cargados
    const confirmarCargaBtn = document.getElementById("confirmarCarga"); // Botón para confirmar la carga
    const mensaje = document.getElementById("mensaje"); // Elemento donde se mostrará el mensaje de confirmación

    // Recuperar datos del usuario, incluyendo el ID
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    console.log("Usuario actual:", usuario); // Muestra los datos del usuario en consola

    // Recuperar el array de tareas desde localStorage
    let tareaActual = JSON.parse(localStorage.getItem("tareaActual")) || [];
    console.log("Tareas registradas:", tareaActual); // Imprime el arreglo de tareas actuales

    // Obtener la última tarea registrada
    let ultimaTarea = tareaActual[tareaActual.length - 1];

    // Validación: Si no hay tarea válida, detiene la ejecución
    if (!ultimaTarea || !ultimaTarea.codigoTarea) {
        console.error("No hay tarea registrada.");
        return;
    }

    console.log("Última tarea registrada:", ultimaTarea); // Muestra la última tarea
    console.log("Pallets cargados:", pallets); // Muestra los pallets cargados

    // Itera sobre la lista de pallets y los agrega a la lista en la interfaz
    pallets.forEach(pallet => {
        resumenList.innerHTML += `<li>${pallet}</li>`; // Agrega cada pallet como un ítem de lista
    });

    // Función para calcular la duración entre dos fechas (inicio y fin)
    function calcularDuracion(operacionInicioStr, operacionFinStr) {
        const inicio = new Date(operacionInicioStr); // Convierte la fecha de inicio a objeto Date
        const fin = new Date(operacionFinStr); // Convierte la fecha de fin a objeto Date

        const diferenciaMs = fin - inicio; // Diferencia en milisegundos
        const diferenciaSegundos = Math.floor(diferenciaMs / 1000); // Conversión a segundos

        const minutos = Math.floor(diferenciaSegundos / 60); // Minutos completos
        const segundos = diferenciaSegundos % 60; // Segundos restantes

        return {
            totalSegundos: diferenciaSegundos,
            formatoLegible: `${minutos}m ${segundos}s` // Formato legible para mostrar duración
        };
    }

    // Función para obtener la hora actual de Chile en formato ISO
    function obtenerFechaHoraChile() {
        const fechaUTC = new Date(); // Obtiene la fecha actual en UTC
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

        // Formatea la fecha a componentes individuales
        const formatoChile = new Intl.DateTimeFormat("es-CL", opciones).formatToParts(fechaUTC);

        // Construye manualmente el string en formato ISO con zona horaria de Chile
        let fechaChileISO = `${formatoChile[4].value}-${formatoChile[2].value}-${formatoChile[0].value}T${formatoChile[6].value}:${formatoChile[8].value}:${formatoChile[10].value}Z`;
        return fechaChileISO;
    }

    // Evento para confirmar la carga de pallets
    confirmarCargaBtn.addEventListener("click", async function () {
        try {
            confirmarCargaBtn.disabled = true; // Desactiva el botón para evitar múltiples envíos

            const operacionFin = obtenerFechaHoraChile(); // Obtiene la fecha y hora actual de Chile
            const duracion = calcularDuracion(ultimaTarea.operacionInicio, operacionFin); // Calcula la duración de la operación

            console.log("Duración de la operación:", duracion.formatoLegible); // Muestra la duración en consola

            mensaje.textContent = "Guardando carga..."; // Muestra mensaje mientras se guarda la carga

            // Envia los datos al servidor para registrar la carga
            const response = await fetch("/tareas/guardarCargaCamion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    codigoTarea: ultimaTarea.codigoTarea,
                    cargas: pallets,
                    operacionInicio: ultimaTarea.operacionInicio,
                    operacionFin: operacionFin,
                    duracionSegundos: duracion.formatoLegible,
                    codigoEscaneado: ultimaTarea.codigoEscaneado,
                    transporte: ultimaTarea.transporte,
                    turno: ultimaTarea.turno,
                    idUsuario: usuario.id
                })
            });

            // Log de los datos enviados para verificación
            console.log({
                codigoTarea: ultimaTarea.codigoTarea,
                cargas: pallets,
                operacionInicio: ultimaTarea.operacionInicio,
                operacionFin: operacionFin,
                codigoEscaneado: ultimaTarea.codigoEscaneado,
                turno: ultimaTarea.turno,
                idUsuario: usuario.id
            });

            const result = await response.json(); // Espera la respuesta del servidor en formato JSON
            console.log(result.message); // Imprime el mensaje de respuesta

            if (response.ok) {
                mensaje.textContent = `Carga completada con ${pallets.length} pallets.`; // Mensaje de éxito

                console.log("Redirección en 3 segundos...");

                // Redirecciona a la pantalla de selección de tareas luego de una pausa
                setTimeout(() => {
                    console.log("Redirigiendo a selecciontarea.html...");
                    window.location.href = "/tareas/seleccion";
                }, 3000);
            } else {
                mensaje.textContent = "Error al guardar la carga."; // Muestra error si la respuesta no es exitosa
                confirmarCargaBtn.disabled = false; // Reactiva el botón
            }
        } catch (error) {
            console.error("Error al enviar la carga:", error); // Captura y muestra errores inesperados
            mensaje.textContent = "Error al conectar con el servidor."; // Mensaje para el usuario
            confirmarCargaBtn.disabled = false; // Reactiva el botón para reintentar
        }
    });
});
