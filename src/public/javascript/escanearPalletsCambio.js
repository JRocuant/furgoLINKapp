// Referencias a elementos del DOM
const confirmarBtn = document.getElementById('confirmarBtn'); // Botón para confirmar el cambio de bahía
const bahiaDestinoInput = document.getElementById('bahiaDestinoCode'); // Campo de texto para ingresar la bahía destino
const mensaje = document.getElementById('mensaje'); // Elemento para mostrar mensajes al usuario
const mensaje2 = document.getElementById('mensaje2'); // Segundo mensaje informativo
const agregarPalletBtn = document.getElementById('agregarPallet'); // Botón para agregar un pallet escaneado
const palletInput = document.getElementById('palletCode'); // Campo de texto para ingresar o escanear código de pallet
const palletList = document.getElementById('palletList'); // Lista visual de pallets escaneados

// Recuperar datos del usuario, incluyendo el ID
const usuario = JSON.parse(localStorage.getItem('usuarioActual')); // Obtener datos del usuario actual desde localStorage
console.log("Usuario actual:", usuario); // Mostrar usuario en consola para depuración

// Variables para almacenar los pallets y la tarea actual
let pallets = []; // Arreglo para guardar códigos de pallets escaneados
let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || []; // Obtener la tarea actual del localStorage
let palletEscaneado = localStorage.getItem("palletEscaneado") || ""; // Recuperar el pallet escaneado del primer formulario

// Función para calcular duración entre dos fechas
function calcularDuracion(operacionInicioStr, operacionFinStr) {
    const inicio = new Date(operacionInicioStr); // Convertir string a objeto Date
    const fin = new Date(operacionFinStr); // Convertir string a objeto Date
    const diferenciaMs = fin - inicio; // Calcular diferencia en milisegundos
    const diferenciaSegundos = Math.floor(diferenciaMs / 1000); // Convertir a segundos
    const minutos = Math.floor(diferenciaSegundos / 60); // Obtener minutos
    const segundos = diferenciaSegundos % 60; // Obtener segundos restantes

    return {
        totalSegundos: diferenciaSegundos, // Total en segundos
        formatoLegible: `${minutos}m ${segundos}s` // Formato legible para mostrar
    };
}

// Función para obtener fecha y hora actual en la zona horaria de Chile
function obtenerFechaHoraChile() {
    const fechaUTC = new Date(); // Obtener fecha y hora actual en UTC
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
    const formatoChile = new Intl.DateTimeFormat("es-CL", opciones).formatToParts(fechaUTC); // Formatear fecha con zona horaria chilena

    // Construir string en formato ISO con los valores extraídos
    let fechaChileISO = `${formatoChile[4].value}-${formatoChile[2].value}-${formatoChile[0].value}T${formatoChile[6].value}:${formatoChile[8].value}:${formatoChile[10].value}Z`;
    return fechaChileISO;
}

// Evento para agregar un pallet escaneado
agregarPalletBtn.addEventListener("click", () => {
    // Obtener y limpiar el valor del input
    const palletValueRaw = palletInput.value.trim();
    const palletCode = palletValueRaw.replace(/\s+/g, ''); // Elimina todos los espacios del código ingresado

    if (palletCode !== "") {
        const ultimaTarea = tareaActual[tareaActual.length - 1]; // Obtener la última tarea en curso

        // Validar si el pallet coincide con el esperado en la tarea
        if (ultimaTarea.palletCambiado !== palletCode) {
            mensaje.textContent = `El pallet escaneado (${palletCode}) no coincide con el pallet de la tarea (${ultimaTarea.palletCambiado}).`;
            console.warn(`El pallet escaneado no coincide. Esperado: ${ultimaTarea.palletCambiado}, Escaneado: ${palletCode}`);
            palletInput.value = ""; // Limpiar input
            return;
        }

        // Validar si el pallet ya fue ingresado previamente
        if (pallets.includes(palletCode)) {
            alert(`El pallet ${palletCode} ya fue ingresado correctamente.`);
            palletInput.value = ""; // Limpiar input
            return;
        }

        // Agregar el pallet al arreglo y mostrarlo en pantalla
        pallets.push(palletCode);
        const listItem = document.createElement("li");
        listItem.textContent = palletCode;
        palletList.appendChild(listItem); // Mostrar en lista visual
        palletInput.value = ""; // Limpiar input

        // Mostrar bahía de origen como información adicional
        mensaje2.textContent = `Pallet desde Bahía de origen ${tareaActual[tareaActual.length - 1].bahiaInicial}`;

        // Habilitar botón Confirmar si hay bahía de destino ingresada
        if (bahiaDestinoInput.value.trim() !== "") {
            confirmarBtn.disabled = false;
        }
    } else {
        alert("Debes ingresar un código de pallet."); // Validación en caso de campo vacío
    }
});

// Evento para habilitar el botón Confirmar cuando se escribe una bahía destino
bahiaDestinoInput.addEventListener("input", () => {
    if (pallets.length > 0 && bahiaDestinoInput.value.trim() !== "") {
        confirmarBtn.disabled = false; // Habilitar botón
    } else {
        confirmarBtn.disabled = true; // Deshabilitar si falta información
    }
});

// Evento para confirmar el cambio de bahía
confirmarBtn.addEventListener("click", async function () {
    if (pallets.length > 0 && bahiaDestinoInput.value.trim() !== "") {
        const bahiaDestino = bahiaDestinoInput.value.trim(); // Obtener bahía destino
        const bahiaInicial = tareaActual[tareaActual.length - 1].bahiaInicial; // Obtener bahía origen

        // Validar que la bahía de destino no sea igual a la de origen
        if (bahiaDestino === bahiaInicial) {
            mensaje.textContent = `La bahía de destino no puede ser la misma que la bahía de origen (${bahiaInicial}).`;
            console.warn(`La bahía de destino (${bahiaDestino}) no puede ser igual a la bahía de origen (${bahiaInicial})`);
            return;
        }

        mensaje.textContent = `Validando...`; // Mensaje de estado
        confirmarBtn.disabled = true; // Evitar múltiples envíos

        console.log("Pallet confirmado:", pallets[0]);
        console.log("Bahía destino:", bahiaDestino);

        // Actualizar la tarea actual con los nuevos valores
        if (tareaActual.length > 0) {
            tareaActual[tareaActual.length - 1].palletConfirmado = pallets[0];
            tareaActual[tareaActual.length - 1].bahiaDestino = bahiaDestino;
        }

        const ultimaTarea = tareaActual[tareaActual.length - 1];

        // Validar que el pallet escaneado coincida con el esperado
        if (ultimaTarea.palletCambiado !== ultimaTarea.palletConfirmado) {
            mensaje.textContent = `El pallet escaneado (${ultimaTarea.palletConfirmado}) no coincide con el pallet de la tarea (${ultimaTarea.palletCambiado}).`;
            console.warn(`El pallet escaneado no coincide. Esperado: ${ultimaTarea.palletCambiado}, Escaneado: ${ultimaTarea.palletConfirmado}`);
            confirmarBtn.disabled = false;
            return;
        }

        localStorage.setItem('tareaActual', JSON.stringify(tareaActual)); // Guardar tarea actualizada
        console.log("Tarea actualizada:", tareaActual);

        try {
            const operacionFin = obtenerFechaHoraChile(); // Obtener hora actual en Chile
            const duracion = calcularDuracion(ultimaTarea.operacionInicio, operacionFin); // Calcular duración

            console.log("Duración de la operación:", duracion.formatoLegible);

            // Enviar datos al backend para guardar el cambio de bahía
            const response = await fetch("/tareas/guardarCambioBahia", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    codigoTarea: ultimaTarea.codigoTarea,
                    operacionInicio: ultimaTarea.operacionInicio,
                    operacionFin: operacionFin,
                    bahiaInicial: ultimaTarea.bahiaInicial,
                    palletConfirmado: ultimaTarea.palletConfirmado,
                    bahiaDestino: ultimaTarea.bahiaDestino,
                    codigoEscaneado: ultimaTarea.codigoEscaneado,
                    duracionSegundos: duracion.formatoLegible,
                    transporte: ultimaTarea.transporte,
                    turno: ultimaTarea.turno,
                    idUsuario: usuario.id
                })
            });

            console.log({
                codigoTarea: ultimaTarea.codigoTarea,
                operacionInicio: ultimaTarea.operacionInicio,
                operacionFin: operacionFin,
                bahiaInicial: ultimaTarea.bahiaInicial,
                palletConfirmado: ultimaTarea.palletConfirmado,
                bahiaDestino: ultimaTarea.bahiaDestino,
                codigoEscaneado: ultimaTarea.codigoEscaneado,
                duracionSegundos: duracion.formatoLegible,
                transporte: ultimaTarea.transporte,
                turno: ultimaTarea.turno,
                idUsuario: usuario.id
            });

            const result = await response.json(); // Parsear respuesta del servidor
            console.log(result.message); // Mostrar mensaje recibido

            if (response.ok) {
                mensaje.textContent = `Pallet cambiado exitosamente a Bahía ${bahiaDestino}`; // Mensaje Éxito
                console.log("Redirección en 3 segundos...");
                setTimeout(() => {
                    console.log("Redirigiendo a selección de tarea...");
                    window.location.href = "/tareas/seleccion"; // Redirigir tras confirmación
                }, 3000);
            } else {
                mensaje.textContent = "Error al guardar el cambio."; // Error del servidor
                confirmarBtn.disabled = false;
            }
        } catch (error) {
            console.error("Error al enviar la información:", error); // Error en conexión o fetch
            mensaje.textContent = "Error al conectar con el servidor.";
            confirmarBtn.disabled = false;
        }
    } else {
        alert("Debe escanear el pallet y la bahía destino antes de confirmar."); // Validación final
    }
});
