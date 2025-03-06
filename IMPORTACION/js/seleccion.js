document.addEventListener('DOMContentLoaded', () => {
    const taskButtons = document.querySelectorAll('.task-btn');

    taskButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedTask = button.getAttribute('data-task');
            sessionStorage.setItem('selectedTask', selectedTask);
            window.location.href = 'espera.html';
        });
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }
});
