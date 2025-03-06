document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === "operador" && password === "1234") {
            sessionStorage.setItem('userRole', 'operador');
            window.location.href = "selecciontarea.html";
        } else {
            errorMessage.textContent = "Usuario o contraseña incorrectos";
            errorMessage.style.display = "block";
        }
    });
});
