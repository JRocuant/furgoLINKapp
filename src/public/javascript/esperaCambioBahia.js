document.addEventListener("DOMContentLoaded", function () {
    // Seleccionamos los elementos del DOM
    const palletInput = document.getElementById("palletInput");
    const bahiaInput = document.getElementById("bahiaInput");
    const continuarBtn = document.getElementById("continuarBtn");

    // Recuperar el array de tareas desde localStorage
    let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || [];
    console.log("Tareas registradas:", tareaActual);

    // Si quieres obtener solo los códigos de tarea
    let codigos = tareaActual.map(tarea => tarea.codigoTarea);
    console.log("Códigos de tarea:", codigos);

    // ESTE CAMBIO ES NUEVO
    // Evento: cuando se escanea el pallet
    palletInput.addEventListener("input", function () {
        if (palletInput.value.trim() !== "") {
            bahiaInput.disabled = false; // Habilita el escaneo de la bahía
        } else {
            bahiaInput.disabled = true; // Deshabilita la bahía si el pallet no está escaneado
            continuarBtn.disabled = true; // También deshabilita el botón continuar
        }
    });

    // Evento: cuando se escanea la bahía
    bahiaInput.addEventListener("input", function () {
        if (bahiaInput.value.trim() !== "") {
            continuarBtn.disabled = false; // Habilita el botón de continuar
        } else {
            continuarBtn.disabled = true; // Si la bahía no está escaneada, deshabilita el botón
        }
    });

    // Evento: al presionar el botón de continuar
    continuarBtn.addEventListener("click", function () {
        console.log("Flujo completado, redirigiendo a la siguiente pantalla...");
        window.location.href = "/tareas/escanearPalletCambio"; // Redirige a la siguiente fase del flujo
    });
});
//HASTA ACÁ XD