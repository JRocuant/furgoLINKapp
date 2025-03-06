document.addEventListener('DOMContentLoaded', function() {
    const recuperarForm = document.getElementById('recuperarForm');

    recuperarForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;

        if (email) {
            alert("Instrucciones enviadas a " + email);
            window.location.href = "index.html";
        } else {
            alert("Por favor, ingresa un correo válido.");
        }
    });
});
