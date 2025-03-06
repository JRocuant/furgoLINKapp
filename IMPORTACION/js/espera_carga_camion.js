document.addEventListener("DOMContentLoaded", function () {
    let pallets = [];
    const palletInput = document.getElementById("palletCode");
    const palletList = document.getElementById("palletList");
    const terminarTareaBtn = document.getElementById("terminarTarea");

    function agregarPallet() {
        const pallet = palletInput.value.trim();
        if (pallet) {
            pallets.push(pallet);
            palletList.innerHTML += `<li>${pallet}</li>`;
            palletInput.value = "";
        } else {
            alert("Debe escanear un pallet.");
        }

        if (pallets.length > 0) {
            terminarTareaBtn.disabled = false;
        }
    }

    document.getElementById("terminarTarea").addEventListener("click", function () {
        sessionStorage.setItem("palletsCargados", JSON.stringify(pallets));
        window.location.href = "resumen_carga_camion.html";
    });

    window.agregarPallet = agregarPallet;
});
