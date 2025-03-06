document.addEventListener("DOMContentLoaded", function () {
    let redirectTimeout;

    const selectedTask = sessionStorage.getItem("selectedTask");
    console.log("Tarea seleccionada desde sessionStorage:", selectedTask);

    const selectedTaskElement = document.getElementById("selectedTask");

    if (selectedTask) {
        selectedTaskElement.textContent = `Tarea seleccionada: ${selectedTask}`;
    } else {
        selectedTaskElement.textContent = "No se ha seleccionado ninguna tarea.";
    }

    let nextPage;
    if (selectedTask === "cambio-entre-bahías") {
        nextPage = "espera_cambio_bahia.html";
    } else {
        nextPage = "espera_pallet.html";
    }


    console.log(`Página de redirección seleccionada: ${nextPage}`);

    redirectTimeout = setTimeout(function () {
        console.log(`Redirigiendo automáticamente a ${nextPage}...`);
        window.location.href = nextPage;
    }, 5000);

    function escanearCodigo(event) {
        const scannedCode = event.target.value.trim();
        if (scannedCode !== "") {
            clearTimeout(redirectTimeout);
            console.log(`Código escaneado, redirigiendo a ${nextPage}...`);
            window.location.href = nextPage;
        }
    }

    document.addEventListener("input", escanearCodigo);

    document.getElementById("cancelBtn").addEventListener("click", function () {
        clearTimeout(redirectTimeout);
        console.log("Redirección cancelada, volviendo a selección de tarea.");
        window.location.href = "selecciontarea.html";
    });
});

