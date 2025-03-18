document.addEventListener("DOMContentLoaded", function () {

    // Recuperar el array de tareas desde localStorage
    let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || [];
    console.log("Tareas registradas:", tareaActual);

    // Obtiene la tarea seleccionada desde sessionStorage
    const selectedTask = sessionStorage.getItem("selectedTask");
    console.log("Tarea seleccionada desde sessionStorage:", selectedTask);

    // Muestra la tarea seleccionada
    const selectedTaskElement = document.getElementById("selectedTask");
    if (selectedTask) {
        selectedTaskElement.textContent = `Tarea seleccionada: ${selectedTask}`;
    } else {
        selectedTaskElement.textContent = "No se ha seleccionado ninguna tarea.";
    }

    // Determina la página siguiente según la tarea
    let nextPage;
    if (selectedTask === "cambio-entre-bahías") {
        nextPage = "/tareas/esperaCambioBahia";
    } else if (selectedTask === "cargar-camion") {
        nextPage = "/tareas/esperaCargaCamion";
    } else {
        nextPage = "/tareas/esperaPallet";
    }

    // Botón para confirmar código
    const submitCodeBtn = document.getElementById("submitCodeBtn");
    const codeInput = document.getElementById("codeInput");

    submitCodeBtn.addEventListener("click", function () {
        const codeValue = codeInput.value.trim();

        if (codeValue !== "") {
            // Agrega el código ingresado a la última tarea registrada
            if (tareaActual.length > 0) {
                tareaActual[tareaActual.length - 1].codigoEscaneado = codeValue;
            }

            // Guarda el array actualizado en localStorage
            localStorage.setItem('tareaActual', JSON.stringify(tareaActual));
            console.log("Código guardado:", codeValue);
            console.log("Código guardado:", tareaActual.codigoEscaneado);
            console.log("Tareas actualizadas:", tareaActual);

            // Redirige a la página correspondiente
            window.location.href = nextPage;
        } else {
            alert("Por favor, ingrese un código válido.");
        }
    });

    // Manejo del botón "Cancelar"
    document.getElementById("cancelBtn").addEventListener("click", function () {
        console.log("Redirección cancelada, volviendo a selección de tarea.");
        window.location.href = "/tareas/seleccion";
    });
});
