// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {

    // Obtiene el botón "Terminar Tarea" por su ID
    const terminarBtn = document.getElementById("terminarTarea");

    // Agrega un evento de clic al botón
    terminarBtn.addEventListener("click", function () {
        // Redirige al usuario a la página de escaneo de bahía
        window.location.href = "escanear_bahia.html";
    });
});
