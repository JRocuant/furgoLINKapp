document.addEventListener("DOMContentLoaded", function () {
    const confirmarBtn = document.getElementById("confirmarBtn");
    const inputBahia = document.getElementById("bahiaCode");
    const mensaje = document.getElementById("mensaje");

    inputBahia.addEventListener("input", function () {
        confirmarBtn.disabled = inputBahia.value.trim() === "";
    });

    confirmarBtn.addEventListener("click", function () {
        if (inputBahia.value.trim() === "") {
            alert("Debe escanear la bahía antes de confirmar.");
            return;
        }

        mensaje.textContent = `✅ Pallet dejado en Bahía ${inputBahia.value}`;
        confirmarBtn.disabled = true;

        console.log("Redirección en 3 segundos...");

        setTimeout(function () {
            console.log("Redirigiendo a selecciontarea.html...");
            window.location.href = "selecciontarea.html";
        }, 3000);
    });
});
