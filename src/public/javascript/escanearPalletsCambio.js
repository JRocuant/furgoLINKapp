document.addEventListener("DOMContentLoaded", function () {
    let pallets = [];
    const palletInput = document.getElementById("palletCode");
    const palletList = document.getElementById("palletList");
    const bahiaDestinoInput = document.getElementById("bahiaDestinoCode");
    const confirmarBtn = document.getElementById("confirmarBtn");
    const agregarPallet = document.getElementById("agregarPallet");
    const mensaje = document.getElementById("mensaje");

    let palletEscaneado = localStorage.getItem("palletEscaneado") || ""; // Recuperar el pallet del primer formulario

    // Aseguramos que el botón "Agregar Pallet" esté deshabilitado inicialmente
    agregarPallet.disabled = true; // Deshabilita el botón al inicio

    // Verificamos si el pallet escaneado en el segundo input coincide con el primero.
    palletInput.addEventListener("input", function () {
        const palletActual = palletInput.value.trim();
        if (palletActual !== palletEscaneado) {
            agregarPallet.disabled = true; // Deshabilitar si no coinciden
        } else {
            agregarPallet.disabled = false; // Habilitar si coinciden
        }
    });

    // Función para actualizar la lista de pallets (aquí solo habrá uno)
    function actualizarLista() {
        palletList.innerHTML = "";
        if (pallets.length > 0) {
            const li = document.createElement("li");
            li.textContent = `📦 Pallet: ${pallets[0]}`;
            palletList.appendChild(li);
        }
        verificarConfirmacion();
    }

    // Verificación para habilitar el botón de confirmación
    function verificarConfirmacion() {
        confirmarBtn.disabled = pallets.length === 0 || bahiaDestinoInput.value.trim() === "";
    }

    // Evento para agregar el pallet cuando el botón es presionado
    agregarPallet.addEventListener("click", function () {
        const pallet = palletInput.value.trim();
        if (pallet === palletEscaneado) {
            if (pallets.length === 0) {
                pallets.push(pallet); // Solo agregar el primer pallet
                actualizarLista(); // Actualizar la visualización
                palletInput.value = ""; // Limpiar el input después de agregarlo
            } else {
                alert("El pallet ya ha sido agregado."); // Prevenir que se agregue más de un pallet
            }
        } else {
            alert("El pallet escaneado no coincide con el primero.");
        }
    });

    // Evento para agregar pallets al hacer clic en el botón "Agregar Pallet"
    //document.getElementById("agregarPallet").addEventListener("click", agregarPallet);

    // Evento para habilitar el botón de confirmar cuando se ingresa la bahía
    bahiaDestinoInput.addEventListener("input", verificarConfirmacion);

    // Evento para confirmar el traslado de pallets
    confirmarBtn.addEventListener("click", function () {
        // Verifica que haya al menos un pallet y que la bahía destino esté ingresada
        if (pallets.length > 0 && bahiaDestinoInput.value.trim() !== "") {
            mensaje.textContent = `✅ Pallets dejados en Bahía ${bahiaDestinoInput.value}`; // Mensaje de éxito
            confirmarBtn.disabled = true; // Deshabilita el botón para evitar múltiples clics
        } else {
            alert("Debe escanear todos los pallets y la bahía destino antes de confirmar."); // Alerta de error
            return;
        }

        console.log("Redirección en 3 segundos...");

        // Redirige automáticamente a la página de selección de tarea después de 3 segundos
        setTimeout(function () {
            console.log("Redirigiendo a selecciontarea.html...");
            window.location.href = "/tareas/seleccion";
        }, 3000);
    });
});
    