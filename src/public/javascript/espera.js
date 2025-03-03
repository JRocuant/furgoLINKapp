document.addEventListener('DOMContentLoaded', () => {
    // Obtiene la tarea seleccionada de sessionStorage
    const selectedTask = sessionStorage.getItem('selectedTask');
    const selectedTaskElement = document.getElementById('selectedTask');

    // Muestra la tarea seleccionada en la pantalla de Esperando Escaneo
    if (selectedTask) {
        selectedTaskElement.textContent = `Tarea seleccionada: ${selectedTask}`;
    } else {
        selectedTaskElement.textContent = 'No se ha seleccionado ninguna tarea.';
    }

    /* // Evento ORIGINAL de clic en el botón de Cancelar
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => {
        // Borra la tarea seleccionada y vuelve a la selección de tarea
        sessionStorage.removeItem('selectedTask');
        window.location.href = 'tareas';
    });*/

    // Función para cancelar selección de tarea
    function cancel() {
        // Crea el mensaje de alerta
        const alertMessage = document.createElement('div');
        alertMessage.classList.add('alert-message', 'success');
        alertMessage.textContent = 'Volviendo al menu de tareas';

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
            window.location.href = 'tareas'; // Redirige a tareas
        }, 1500);
    }

    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancel);
    }
});
