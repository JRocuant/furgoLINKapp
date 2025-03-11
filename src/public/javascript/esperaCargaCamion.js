// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {

    let pallets = []; // Array para almacenar los códigos de los pallets escaneados

    // Obtiene los elementos del DOM
    const palletInput = document.getElementById("palletCode"); // Campo de entrada para escanear pallet
    const palletList = document.getElementById("palletList"); // Lista donde se mostrarán los pallets agregados
    const terminarTareaBtn = document.getElementById("terminarTarea"); // Botón para finalizar la tarea

    // Función para agregar pallet a la lista
    function agregarPallet() {
        const pallet = palletInput.value.trim(); // Obtiene el valor ingresado y elimina espacios en blanco

        if (pallet) {
            pallets.push(pallet); // Agrega el pallet al array
            palletList.innerHTML += `<li>${pallet}</li>`; // Agrega el pallet a la lista en el DOM
            palletInput.value = ""; // Limpia el campo de entrada después de agregar el pallet
        } else {
            alert("Debe escanear un pallet."); // Muestra una alerta si no hay código ingresado
        }

        // Si hay al menos un pallet en la lista, habilita el botón de terminar tarea
        if (pallets.length > 0) {
            terminarTareaBtn.disabled = false;
        }
    }

    // Evento para finalizar la tarea y redirigir a la pantalla de resumen
    document.getElementById("terminarTarea").addEventListener("click", function () {
        sessionStorage.setItem("palletsCargados", JSON.stringify(pallets)); // Guarda los pallets en sessionStorage
        window.location.href = "/tareas/resumenCargaCamion"; // Redirige a la página de resumen de carga
    });

    // Expone la función `agregarPallet` al objeto global `window`
    window.agregarPallet = agregarPallet;
});
