document.addEventListener("DOMContentLoaded", function () { // Espera a que el DOM esté completamente cargado antes de ejecutar el script

    // Recuperar el array de tareas desde localStorage
    let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || []; // Obtiene el arreglo de tareas almacenadas o lo inicializa vacío si no existe
    console.log("Tareas registradas:", tareaActual); // Muestra las tareas registradas en consola para depuración

    // Obtiene la tarea seleccionada desde sessionStorage
    const selectedTask = sessionStorage.getItem("selectedTask"); // Recupera la tarea seleccionada de la sesión actual
    console.log("Tarea seleccionada desde sessionStorage:", selectedTask); // Imprime la tarea seleccionada para depuración

    // Muestra la tarea seleccionada
    const selectedTaskElement = document.getElementById("selectedTask"); // Referencia al elemento que muestra la tarea seleccionada
    if (selectedTask) { // Si hay una tarea seleccionada
        selectedTaskElement.textContent = `Tarea seleccionada: ${selectedTask}`; // Muestra el nombre de la tarea
    } else {
        selectedTaskElement.textContent = "No se ha seleccionado ninguna tarea."; // Muestra mensaje por defecto si no hay tarea
    }

    // Determina la página siguiente según la tarea
    let nextPage; // Variable para definir la redirección
    if (selectedTask === "cambio-entre-bahías") { // Si la tarea es cambio de bahía
        nextPage = "/tareas/esperaCambioBahia";
    } else if (selectedTask === "cargar-camion") { // Si la tarea es carga de camión
        nextPage = "/tareas/esperaCargaCamion";
    } else {
        nextPage = "/tareas/esperaPallet"; // La tarea es retirar pallet
    }

    // Botón para confirmar código
    const submitCodeBtn = document.getElementById("submitCodeBtn"); // Referencia al botón de envío
    const codeInput = document.getElementById("codeInput"); // Referencia al campo de entrada de código

    function obtenerTransporteYPalet(codigo) { // Función para extraer información del código escaneado
        // Expresión regular para obtener los datos del código
        const regex = /^000(\d{7})\d{14}(\d{2})$/; // Formato esperado del código: empieza con "000", seguido de 7 dígitos (transporte), 14 ceros y termina con 2 dígitos (pallet)
        
        console.log("Código a evaluar:", codigo); // Muestra el código recibido en consola
        const resultado = regex.exec(codigo); // Ejecuta la expresión regular sobre el código

        if (resultado) { // Si hay coincidencia con el patrón
            const transporte = resultado[1]; // Extrae el código de transporte
            const pallet = resultado[2]; // Extrae el número de pallet

            console.log("Código de transporte:", transporte);  // Muestra el transporte extraído
            console.log("Número de pallet:", pallet);  // Muestra el pallet extraído

            return { transporte, pallet }; // Devuelve un objeto con ambos valores
        } else {
            console.log("Código inválido"); // Mensaje si el código no cumple con el formato esperado
            return null; // Retorna null si no se extrajo información
        }
    }

    submitCodeBtn.addEventListener("click", function () { // Evento al hacer clic en el botón de envío
        // Eliminar todos los espacios del input
        const codeValueRaw = codeInput.value.trim(); // Elimina espacios al inicio y al final del input
        const codeValue = codeValueRaw.replace(/\s+/g, ''); // Elimina todos los espacios intermedios también

        const datos = obtenerTransporteYPalet(codeValue); // Obtiene transporte y pallet del código

        if (codeValue !== "" && datos) { // Si el código no está vacío y tiene datos válidos
            // Aquí se elimina la validación con la base de datos y se sigue adelante sin verificar en la base de datos
            if (tareaActual.length > 0) { // Si existe al menos una tarea en el arreglo
                tareaActual[tareaActual.length - 1].codigoEscaneado = codeValue; // Guarda el código escaneado en la última tarea
                tareaActual[tareaActual.length - 1].transporte = datos.transporte; // Guarda el transporte en la última tarea
            }

            localStorage.setItem('tareaActual', JSON.stringify(tareaActual)); // Actualiza el localStorage con la tarea modificada
            console.log("Código guardado:", codeValue); // Muestra el código guardado en consola
            window.location.href = nextPage; // Redirige a la siguiente página según el tipo de tarea
        } else {
            alert("Por favor, ingrese un código válido."); // Alerta al usuario si el código es inválido
        }
    });

    // Manejo del botón "Cancelar"
    document.getElementById("cancelBtn").addEventListener("click", function () { // Evento al hacer clic en el botón cancelar
        console.log("Redirección cancelada, volviendo a selección de tarea."); // Mensaje en consola
        window.location.href = "/tareas/seleccion"; // Redirige a la página de selección de tarea
    });
});
