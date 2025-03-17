// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {
    // Obtiene la lista de pallets almacenados en sessionStorage y los convierte en un array
    const pallets = JSON.parse(sessionStorage.getItem("palletsCargados")) || [];

    // Obtiene los elementos del DOM
    const resumenList = document.getElementById("resumenList"); // Lista donde se mostrarán los pallets cargados
    const confirmarCargaBtn = document.getElementById("confirmarCarga"); // Botón para confirmar la carga
    const mensaje = document.getElementById("mensaje"); // Elemento donde se mostrará el mensaje de confirmación

    // Recuperar el array de tareas desde localStorage
    let tareaActual = JSON.parse(localStorage.getItem("tareaActual")) || [];
    console.log("Tareas registradas:", tareaActual);

    // Obtener la última tarea registrada
    let ultimaTarea = tareaActual[tareaActual.length - 1];

    if (!ultimaTarea || !ultimaTarea.codigoTarea) {
        console.error("No hay tarea registrada.");
        return;
    }

    console.log("Última tarea registrada:", ultimaTarea);
    console.log("Pallets cargados:", pallets);

    // Itera sobre la lista de pallets y los agrega a la lista en la interfaz
    pallets.forEach(pallet => {
        resumenList.innerHTML += `<li>${pallet}</li>`;
    });

    // Evento para confirmar la carga
    confirmarCargaBtn.addEventListener("click", async function () {
        try {
            // Deshabilita el botón para evitar múltiples clics
            confirmarCargaBtn.disabled = true;

            // Muestra un mensaje de carga en la interfaz
            mensaje.textContent = "⏳ Guardando carga...";

            // Enviar datos al servidor para guardar en la base de datos
            const response = await fetch("/tareas/guardarCargaCamion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    codigoTarea: ultimaTarea.codigoTarea,
                    cargas: pallets
                })
            });

            console.log({
                codigoTarea: ultimaTarea.codigoTarea,
                cargas: pallets
            });

            const result = await response.json();
            console.log(result.message);

            if (response.ok) {
                // Muestra un mensaje de confirmación en la interfaz
                mensaje.textContent = `✅ Carga completada con ${pallets.length} pallets.`;

                console.log("Redirección en 3 segundos...");

                // Redirige automáticamente a la pantalla de selección de tarea después de 3 segundos
                setTimeout(() => {
                    console.log("Redirigiendo a selecciontarea.html...");
                    window.location.href = "/tareas/seleccion";
                }, 3000);
            } else {
                mensaje.textContent = "❌ Error al guardar la carga.";
                confirmarCargaBtn.disabled = false;
            }
        } catch (error) {
            console.error("Error al enviar la carga:", error);
            mensaje.textContent = "❌ Error al conectar con el servidor.";
            confirmarCargaBtn.disabled = false;
        }
    });
});
