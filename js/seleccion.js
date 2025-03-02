// Ejecutar el script solo cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los botones de tarea
    const taskButtons = document.querySelectorAll('.task-btn');

    // Añade un evento de clic a cada botón de tarea
    taskButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Captura la tarea seleccionada usando el atributo data-task
            const selectedTask = button.getAttribute('data-task');

            // Guarda la tarea seleccionada en sessionStorage
            sessionStorage.setItem('selectedTask', selectedTask);

            // Redirige a la pantalla de Esperando Escaneo
            window.location.href = 'espera.html';
        });
    });

    // Función para cerrar sesión con mensaje animado
    function logout() {
        // Crea el mensaje de alerta
        const alertMessage = document.createElement('div');
        alertMessage.classList.add('alert-message', 'success');
        alertMessage.textContent = 'Has cerrado sesión exitosamente';

        // Agrega el mensaje al body
        document.body.appendChild(alertMessage);

        // Muestra la alerta con animación
        setTimeout(() => {
            alertMessage.classList.add('show');
        }, 100);

        // Espera 1.5 segundos antes de redirigir
        setTimeout(() => {
            alertMessage.classList.remove('show');
            sessionStorage.clear(); // Borra la sesión
            window.location.href = 'Login.html'; // Redirige a Login
        }, 1500);
    }

    // Evento de clic en el botón de Cerrar Sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});
