// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {

    // Selecciona todos los botones de tareas con la clase 'task-btn'
    const taskButtons = document.querySelectorAll('.task-btn');

    // Itera sobre cada botón de tarea y le asigna un evento de clic
    taskButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Obtiene el valor del atributo 'data-task' del botón presionado
            const selectedTask = button.getAttribute('data-task');
            // Almacena la tarea seleccionada en sessionStorage y la convierte a minúsculas para mantener consistencia
            sessionStorage.setItem('selectedTask', selectedTask.toLowerCase());
            // Redirige a la pantalla de espera
            window.location.href = '/tareas/espera';
        });
    });

    // Obtiene el botón de cerrar sesión por su ID
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) { // Verifica que el botón exista en la página
        logoutBtn.addEventListener('click', () => {
            // Limpia la sesión del usuario eliminando todos los datos almacenados en sessionStorage
            sessionStorage.clear();
            // Redirige al usuario a la página de inicio de sesión
            window.location.href = '/';
        });
    }
});
