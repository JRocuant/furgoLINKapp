document.addEventListener("DOMContentLoaded", function () {
    const pallets = JSON.parse(sessionStorage.getItem("palletsCargados")) || [];
    const resumenList = document.getElementById("resumenList");
    const confirmarCargaBtn = document.getElementById("confirmarCarga");
    const mensaje = document.getElementById("mensaje");

    pallets.forEach(pallet => {
        resumenList.innerHTML += `<li>${pallet}</li>`;
    });

    confirmarCargaBtn.addEventListener("click", function () {
        mensaje.textContent = `✅ Carga completada con ${pallets.length} pallets.`;
        confirmarCargaBtn.disabled = true;

     console.log("Redirección en 3 segundos...");

            // Redirección automática después de 3 segundos
            setTimeout(function () {
                console.log("Redirigiendo a selecciontarea.html...");
                window.location.href = "selecciontarea.html";
            }, 3000);

    });
});
