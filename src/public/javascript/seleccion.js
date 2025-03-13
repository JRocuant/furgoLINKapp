// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los botones de tareas con la clase 'task-btn'
    const taskButtons = document.querySelectorAll('.task-btn');

    taskButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Obtiene el valor del atributo 'data-task' del botón presionado
            const selectedTask = button.getAttribute('data-task').toLowerCase();

            // Almacena en sessionStorage para compatibilidad con código existente
            sessionStorage.setItem('selectedTask', selectedTask);

            // Recupera el array desde localStorage o crea uno nuevo si no existe
            let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || [];

            // Crea un nuevo objeto de tarea
            let nuevaTarea = {
                codigoTarea: selectedTask
            };

            // Agrega la nueva tarea al array
            tareaActual.push(nuevaTarea);

            // Guarda el array actualizado en localStorage
            localStorage.setItem('tareaActual', JSON.stringify(tareaActual));

            // Redirige a la pantalla de espera
            window.location.href = '/tareas/espera';
        });
    });

    // Obtiene el botón de cerrar sesión por su ID
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Limpia sessionStorage y localStorage al cerrar sesión
            sessionStorage.clear();
            localStorage.removeItem('tareaActual');

            // Redirige al usuario a la página de inicio de sesión
            window.location.href = '/';
        });
    }
});
