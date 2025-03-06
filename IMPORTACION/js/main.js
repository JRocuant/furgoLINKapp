function checkSession() {
    const userRole = sessionStorage.getItem('userRole');
    if (userRole === 'operador') {
        window.location.href = 'selecciontarea.html';
    } else if (userRole === 'admin') {
        window.location.href = 'admin-dashboard.html';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
});
