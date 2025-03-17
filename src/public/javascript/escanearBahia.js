// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {

    // Obtiene los elementos del DOM necesarios
    const confirmarBtn = document.getElementById("confirmarBtn"); // Botón de confirmar
    const inputBahia = document.getElementById("bahiaCode"); // Campo de entrada para el código de la bahía
    const mensaje = document.getElementById("mensaje"); // Elemento para mostrar mensajes al usuario

    // Recuperar el array de tareas desde localStorage
    let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || [];
    console.log("Tareas registradas:", tareaActual);

    // Si quieres obtener solo los códigos de tarea
    let codigos = tareaActual.map(tarea => tarea.codigoTarea);
    console.log("Códigos de tarea:", codigos);

    // Obtiene la última tarea registrada (suponiendo que es la tarea en curso)
    let ultimaTarea = tareaActual[tareaActual.length - 1];

    console.log("Última tarea registrada:", ultimaTarea);

    // Evento que activa/desactiva el botón de confirmar según el contenido del input
    inputBahia.addEventListener("input", function () {
        confirmarBtn.disabled = inputBahia.value.trim() === ""; // Si el campo está vacío, deshabilita el botón
    });

    // Evento que se ejecuta cuando el usuario hace clic en el botón "Confirmar"
    confirmarBtn.addEventListener("click", async function () {
        try {
            // Deshabilita el botón para evitar múltiples clics
            confirmarBtn.disabled = true;

            // Muestra un mensaje de carga en la interfaz
            mensaje.textContent = "⏳ Guardando carga...";

            // Enviar datos al servidor para guardar en la base de datos
            const response = await fetch("/tareas/guardarPalletListo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    codigoTarea: ultimaTarea.codigoTarea
                })
            });

            const result = await response.json();
            console.log(result.message);

            if (response.ok) {
                

                console.log("Redirección en 3 segundos...");

                // Redirige automáticamente a la pantalla de selección de tarea después de 3 segundos
                setTimeout(() => {
                    console.log("Redirigiendo a selecciontarea.html...");
                    window.location.href = "/tareas/seleccion";
                }, 3000);
            } else {
                mensaje.textContent = "❌ Error al guardar la carga.";
                confirmarBtn.disabled = false;
            }
        } catch (error) {
            console.error("Error al enviar la carga:", error);
            mensaje.textContent = "❌ Error al conectar con el servidor.";
            confirmarBtn.disabled = false;
        }
    });
});
