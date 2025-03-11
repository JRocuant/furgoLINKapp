// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {

    // Obtiene los elementos del DOM necesarios
    const confirmarBtn = document.getElementById("confirmarBtn"); // Botón de confirmar
    const inputBahia = document.getElementById("bahiaCode"); // Campo de entrada para el código de la bahía
    const mensaje = document.getElementById("mensaje"); // Elemento para mostrar mensajes al usuario

    // Evento que activa/desactiva el botón de confirmar según el contenido del input
    inputBahia.addEventListener("input", function () {
        confirmarBtn.disabled = inputBahia.value.trim() === ""; // Si el campo está vacío, deshabilita el botón
    });

    // Evento que se ejecuta cuando el usuario hace clic en el botón "Confirmar"
    confirmarBtn.addEventListener("click", function () {
        // Verifica si el usuario ingresó o escaneó un código de bahía
        if (inputBahia.value.trim() === "") {
            alert("Debe escanear la bahía antes de confirmar."); // Muestra una alerta si no se ingresó código
            return; // Sale de la función para evitar continuar con la ejecución
        }

        // Muestra un mensaje de confirmación en la pantalla
        mensaje.textContent = `✅ Pallet dejado en Bahía ${inputBahia.value}`;

        // Deshabilita el botón de confirmar para evitar múltiples clics
        confirmarBtn.disabled = true;

        console.log("Redirección en 3 segundos...");

        // Redirige automáticamente a la pantalla de selección de tarea después de 3 segundos
        setTimeout(function () {
            console.log("Redirigiendo a selecciontarea.html...");
            window.location.href = "/tareas/seleccion";
        }, 3000);
    });
});
