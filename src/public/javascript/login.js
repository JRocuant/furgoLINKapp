// Ejecutar el script solo cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Captura el formulario de inicio de sesión
    const loginForm = document.getElementById('loginForm');
    const alertMessage = document.getElementById('alertMessage');

    // Evento de envío del formulario
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que se recargue la página

            // Captura los valores ingresados
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Simula validación de credenciales
            if (username === 'operador' && password === '1234') {
                sessionStorage.setItem('userRole', 'admin'); // Guarda el rol en sessionStorage

                // Mostrar alerta de éxito
                alertMessage.textContent = 'Inicio de sesión exitoso';
                alertMessage.classList.add('show', 'success');

                // Redirige a la pantalla de selección de tarea
                setTimeout(() => {
                    window.location.href = '/tareas';
                }, 500);
            } else {
                // Mostrar alerta de error
                alertMessage.textContent = 'Usuario o contraseña incorrectos';
                alertMessage.classList.add('show', 'error');

                // Ocultar alerta después de 1.5 segundos
                setTimeout(() => {
                    alertMessage.classList.remove('show');
                }, 1500);
            }
        });
    }
});
