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

    // Evento de clic en el botón de Cancelar
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => {
        // Borra la tarea seleccionada y vuelve a la selección de tarea
        sessionStorage.removeItem('selectedTask');
        window.location.href = 'selecciontarea.html';
    });
});
