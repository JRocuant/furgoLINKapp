document.addEventListener("DOMContentLoaded", function () {
    let pallets = [];
    const palletInput = document.getElementById("palletCode");
    const palletList = document.getElementById("palletList");
    const bahiaDestinoInput = document.getElementById("bahiaDestinoCode");
    const confirmarBtn = document.getElementById("confirmarBtn");
    const mensaje = document.getElementById("mensaje");

    // Función para agregar pallet a la lista
    function agregarPallet() {
        const pallet = palletInput.value.trim();
        if (pallet) {
            pallets.push(pallet);
            actualizarLista();
            palletInput.value = ""; // Limpiar input
        } else {
            alert("Debe escanear un pallet.");
        }
    }

    // Función para actualizar la lista de pallets en el HTML
    function actualizarLista() {
        palletList.innerHTML = ""; // Limpiar la lista
        pallets.forEach((pallet, index) => {
            const li = document.createElement("li");
            li.textContent = `📦 Pallet ${index + 1}: ${pallet}`;
            palletList.appendChild(li);
        });
        verificarConfirmacion();
    }

    // Función para verificar si se puede habilitar el botón de confirmar
    function verificarConfirmacion() {
        confirmarBtn.disabled = pallets.length === 0 || bahiaDestinoInput.value.trim() === "";
    }

    // Evento para agregar pallets
    document.getElementById("agregarPallet").addEventListener("click", agregarPallet);

    // Evento para habilitar el botón de confirmar cuando se ingresa la bahía
    bahiaDestinoInput.addEventListener("input", verificarConfirmacion);

    // Evento para confirmar el traslado
    confirmarBtn.addEventListener("click", function () {
        if (pallets.length > 0 && bahiaDestinoInput.value.trim() !== "") {
            mensaje.textContent = `✅ Pallets dejados en Bahía ${bahiaDestinoInput.value}`;
            confirmarBtn.disabled = true;
        } else {
            alert("Debe escanear todos los pallets y la bahía destino antes de confirmar.");
        }

     console.log("Redirección en 3 segundos...");

            // Redirección automática después de 3 segundos
            setTimeout(function () {
                console.log("Redirigiendo a selecciontarea.html...");
                window.location.href = "selecciontarea.html";
            }, 3000);
    });
});
