// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {
    let redirectTimeout; // Variable para almacenar el temporizador de redirección automática

    // Obtiene la tarea seleccionada desde sessionStorage
    const selectedTask = sessionStorage.getItem("selectedTask");
    console.log("Tarea seleccionada desde sessionStorage:", selectedTask);

    // Obtiene el elemento donde se mostrará la tarea seleccionada
    const selectedTaskElement = document.getElementById("selectedTask");

    // Verifica si hay una tarea seleccionada y la muestra en la pantalla
    if (selectedTask) {
        selectedTaskElement.textContent = `Tarea seleccionada: ${selectedTask}`;
    } else {
        selectedTaskElement.textContent = "No se ha seleccionado ninguna tarea.";
    }

    let nextPage; // Variable para determinar la página a la que se redirigirá

    // Asigna la página de redirección según la tarea seleccionada
    if (selectedTask === "cambio-entre-bahías") {
        nextPage = "/tareas/esperaCambioBahia";
    } else if (selectedTask === "cargar-camion") { // Ahora en minúsculas
        nextPage = "/tareas/esperaCargaCamion";
    } else {
        nextPage = "/tareas/esperaPallet"; // Página por defecto si no coincide con las otras tareas
    }

    console.log(`Página de redirección seleccionada: ${nextPage}`);

    // Configura un temporizador para redirigir automáticamente después de 5 segundos
    redirectTimeout = setTimeout(function () {
        console.log(`Redirigiendo automáticamente a ${nextPage}...`);
        window.location.href = nextPage;
    }, 5000);

    // Función que se ejecuta cuando el usuario escanea un código
    function escanearCodigo(event) {
        const scannedCode = event.target.value.trim(); // Obtiene y limpia el código escaneado
        if (scannedCode !== "") {
            clearTimeout(redirectTimeout); // Cancela la redirección automática
            console.log(`Código escaneado, redirigiendo a ${nextPage}...`);
            window.location.href = nextPage; // Redirige a la página correspondiente
        }
    }

    // Agrega un evento de entrada (input) para detectar el escaneo de códigos
    document.addEventListener("input", escanearCodigo);

    // Manejo del botón "Cancelar"
    document.getElementById("cancelBtn").addEventListener("click", function () {
        clearTimeout(redirectTimeout); // Cancela la redirección automática
        console.log("Redirección cancelada, volviendo a selección de tarea.");
        window.location.href = "/tareas/seleccion"; // Vuelve a la pantalla de selección de tarea
    });
});
