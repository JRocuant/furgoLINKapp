// Referencias a elementos del DOM
const confirmarBtn = document.getElementById('confirmarBtn');
const bahiaDestinoInput = document.getElementById('bahiaDestinoCode');
const mensaje = document.getElementById('mensaje');
const agregarPalletBtn = document.getElementById('agregarPallet');
const palletInput = document.getElementById('palletCode');
const palletList = document.getElementById('palletList');

// Recuperar datos del usuario, incluyendo el ID
const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
console.log("Usuario actual:", usuario);

// Variables para almacenar los pallets y la tarea actual
let pallets = [];
let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || [];
let palletEscaneado = localStorage.getItem("palletEscaneado") || ""; // Recuperar el pallet del primer formulario

// Función para calcular duración
function calcularDuracion(operacionInicioStr, operacionFinStr) {
    const inicio = new Date(operacionInicioStr);
    const fin = new Date(operacionFinStr);
    const diferenciaMs = fin - inicio;
    const diferenciaSegundos = Math.floor(diferenciaMs / 1000);
    const minutos = Math.floor(diferenciaSegundos / 60);
    const segundos = diferenciaSegundos % 60;

    return {
        totalSegundos: diferenciaSegundos,
        formatoLegible: `${minutos}m ${segundos}s`
    };
}

// Evento para agregar pallet escaneado
agregarPalletBtn.addEventListener("click", () => {
    const palletCode = palletInput.value.trim();

    if (palletCode !== "") {
        const ultimaTarea = tareaActual[tareaActual.length - 1];

        // Verificar si coincide con el pallet de la tarea
        if (ultimaTarea.palletCambiado !== palletCode) {
            mensaje.textContent = `❌ El pallet escaneado (${palletCode}) no coincide con el pallet de la tarea (${ultimaTarea.palletCambiado}).`;
            console.warn(`El pallet escaneado no coincide. Esperado: ${ultimaTarea.palletCambiado}, Escaneado: ${palletCode}`);
            palletInput.value = "";
            return;
        }

        // Verificar si ya fue ingresado
        if (pallets.includes(palletCode)) {
            alert(`El pallet ${palletCode} ya fue ingresado correctamente.`);
            palletInput.value = "";
            return;
        }

        // Si no está, agregarlo
        pallets.push(palletCode);

        // Mostrar en la lista visual solo una vez
        const listItem = document.createElement("li");
        listItem.textContent = palletCode;
        palletList.appendChild(listItem);

        palletInput.value = "";

        // Habilitar botón si ambos campos tienen datos
        if (bahiaDestinoInput.value.trim() !== "") {
            confirmarBtn.disabled = false;
        }
    } else {
        alert("Debes ingresar un código de pallet.");
    }
});


// Evento para habilitar el botón Confirmar al ingresar bahía
bahiaDestinoInput.addEventListener("input", () => {
    if (pallets.length > 0 && bahiaDestinoInput.value.trim() !== "") {
        confirmarBtn.disabled = false;
    } else {
        confirmarBtn.disabled = true;
    }
});

// Evento para confirmar el cambio
confirmarBtn.addEventListener("click", async function () {
    if (pallets.length > 0 && bahiaDestinoInput.value.trim() !== "") {
        const bahiaDestino = bahiaDestinoInput.value.trim();

        mensaje.textContent = `⏳ Validando...`;
        confirmarBtn.disabled = true;

        console.log("Pallet confirmado:", pallets[0]);
        console.log("Bahía destino:", bahiaDestino);

        // Actualizar tareaActual
        if (tareaActual.length > 0) {
            tareaActual[tareaActual.length - 1].palletConfirmado = pallets[0];
            tareaActual[tareaActual.length - 1].bahiaDestino = bahiaDestino;
        }

        const ultimaTarea = tareaActual[tareaActual.length - 1];

        // Validar que palletConfirmado y palletCambiado sean iguales
        if (ultimaTarea.palletCambiado !== ultimaTarea.palletConfirmado) {
            mensaje.textContent = `❌ El pallet escaneado (${ultimaTarea.palletConfirmado}) no coincide con el pallet de la tarea (${ultimaTarea.palletCambiado}).`;
            console.warn(`El pallet escaneado no coincide. Esperado: ${ultimaTarea.palletCambiado}, Escaneado: ${ultimaTarea.palletConfirmado}`);
            confirmarBtn.disabled = false;
            return; // Detener ejecución
        }

        localStorage.setItem('tareaActual', JSON.stringify(tareaActual));
        console.log("Tarea actualizada:", tareaActual);

        try {
            const operacionFin = new Date().toISOString();
            const duracion = calcularDuracion(ultimaTarea.operacionInicio, operacionFin);
            console.log("Duración de la operación:", duracion.formatoLegible);

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
                idUsuario: usuario.id
            });

            const result = await response.json();
            console.log(result.message);

            if (response.ok) {
                mensaje.textContent = `✅ Pallet cambiado exitosamente a Bahía ${bahiaDestino}`;
                console.log("Redirección en 3 segundos...");
                setTimeout(() => {
                    console.log("Redirigiendo a selección de tarea...");
                    window.location.href = "/tareas/seleccion";
                }, 3000);
            } else {
                mensaje.textContent = "❌ Error al guardar el cambio.";
                confirmarBtn.disabled = false;
            }
        } catch (error) {
            console.error("Error al enviar la información:", error);
            mensaje.textContent = "❌ Error al conectar con el servidor.";
            confirmarBtn.disabled = false;
        }

    } else {
        alert("Debe escanear el pallet y la bahía destino antes de confirmar.");
    }
});
