document.addEventListener("DOMContentLoaded", function () {
    const terminarTareaBtn = document.getElementById("terminarTarea");

    if (terminarTareaBtn) {
        terminarTareaBtn.addEventListener("click", function () {
            console.log("Tarea terminada, redirigiendo a escanear_pallets_cambio.html...");
            window.location.href = "escanear_pallets_cambio.html";
        });
    }
});
