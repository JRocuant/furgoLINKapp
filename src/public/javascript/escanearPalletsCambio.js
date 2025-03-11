// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {

    console.log("Script cargado correctamente"); // Verifica si el script está activo

    let pallets = []; // Almacena los códigos de los pallets escaneados

    // Obtiene los elementos del DOM
    const palletInput = document.getElementById("palletCode"); // Campo de entrada para escanear pallet
    const palletList = document.getElementById("palletList"); // Lista donde se mostrarán los pallets agregados
    const bahiaDestinoInput = document.getElementById("bahiaDestinoCode"); // Campo para ingresar la bahía destino
    const confirmarBtn = document.getElementById("confirmarBtn"); // Botón para confirmar el traslado
    const mensaje = document.getElementById("mensaje"); // Elemento para mostrar mensajes al usuario

    // Función para agregar pallet a la lista
    function agregarPallet() {
        const pallet = palletInput.value.trim(); // Elimina espacios en blanco del input
        if (pallet) {
            pallets.push(pallet); // Agrega el pallet a la lista
            actualizarLista(); // Actualiza la lista visualmente
            palletInput.value = ""; // Limpia el campo de entrada después de agregar el pallet
        } else {
            alert("Debe escanear un pallet."); // Muestra una alerta si no hay código ingresado
        }
    }

    // Función para actualizar la lista de pallets en el HTML
    function actualizarLista() {
        palletList.innerHTML = ""; // Limpia la lista antes de actualizarla
        pallets.forEach((pallet, index) => {
            const li = document.createElement("li"); // Crea un elemento de lista <li>
            li.textContent = `📦 Pallet ${index + 1}: ${pallet}`; // Agrega el texto con el número de pallet
            palletList.appendChild(li); // Agrega el elemento a la lista en el DOM
        });
        verificarConfirmacion(); // Verifica si se puede habilitar el botón de confirmar
    }

    // Función para verificar si se puede habilitar el botón de confirmar
    function verificarConfirmacion() {
        confirmarBtn.disabled = pallets.length === 0 || bahiaDestinoInput.value.trim() === "";
        // Habilita el botón solo si hay pallets y la bahía destino está ingresada
    }

    // Evento para agregar pallets al hacer clic en el botón "Agregar Pallet"
    document.getElementById("agregarPallet").addEventListener("click", agregarPallet);

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
