// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {

    // Obtiene la lista de pallets almacenados en sessionStorage y los convierte en un array
    const pallets = JSON.parse(sessionStorage.getItem("palletsCargados")) || [];

    // Obtiene los elementos del DOM
    const resumenList = document.getElementById("resumenList"); // Lista donde se mostrarán los pallets cargados
    const confirmarCargaBtn = document.getElementById("confirmarCarga"); // Botón para confirmar la carga
    const mensaje = document.getElementById("mensaje"); // Elemento donde se mostrará el mensaje de confirmación

    // Recuperar el array de tareas desde localStorage
    let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || [];
    console.log("Tareas registradas:", tareaActual);

    // Si quieres obtener solo los códigos de tarea
    let codigos = tareaActual.map(tarea => tarea.codigoTarea);
    console.log("Códigos de tarea:", codigos);

    // Obtener la última tarea registrada
    let ultimaTarea = tareaActual[tareaActual.length - 1];

    console.log("Última tarea registrada:", ultimaTarea);
    console.log("Pallets cargados:", ultimaTarea.palletsCargados);

    // Itera sobre la lista de pallets y los agrega a la lista en la interfaz
    pallets.forEach(pallet => {
        resumenList.innerHTML += `<li>${pallet}</li>`;
    });

    // Evento para confirmar la carga
    confirmarCargaBtn.addEventListener("click", function () {
        // Muestra un mensaje de confirmación en la interfaz
        mensaje.textContent = `✅ Carga completada con ${pallets.length} pallets.`;

        // Deshabilita el botón para evitar múltiples clics
        confirmarCargaBtn.disabled = true;

        console.log("Redirección en 3 segundos...");

        // Redirige automáticamente a la pantalla de selección de tarea después de 3 segundos
        setTimeout(function () {
            console.log("Redirigiendo a selecciontarea.html...");
            window.location.href = "/tareas/seleccion";
        }, 3000);
    });

});
