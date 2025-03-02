// Verifica si el usuario ha iniciado sesión y redirige según el rol
function checkSession() {
    const userRole = sessionStorage.getItem('userRole');
    if (userRole === 'operador') {
        window.location.href = 'selecciontarea.html';
    } else if (userRole === 'admin') {
        window.location.href = 'admin-dashboard.html';
    }
}

// Al cargar el documento, verifica la sesión
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
});

// Función para iniciar sesión y guardar el rol en sessionStorage
function login(username, password) {
    if (username === 'admin' && password === '1234') {
        sessionStorage.setItem('userRole', 'admin');
        alert('Bienvenido, Administrador');
        window.location.href = 'admin-dashboard.html';
    } else if (username === 'operador' && password === '1234') {
        sessionStorage.setItem('userRole', 'operador');
        alert('Bienvenido, Operador');
        window.location.href = 'selecciontarea.html';
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

// Función para cerrar sesión y borrar la sesión
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// Función para redirigir al Dashboard o Selección de Tarea según el rol
function redirectByRole() {
    const userRole = sessionStorage.getItem('userRole');
    if (userRole === 'admin') {
        window.location.href = 'admin-dashboard.html';
    } else if (userRole === 'operador') {
        window.location.href = 'selecciontarea.html';
    } else {
        window.location.href = 'login.html';
    }
}

// Exporta funciones para usarlas en otros archivos JS
export { login, logout, redirectByRole };

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then(registration => {
          console.log('Service Worker registrado con éxito:', registration);
        })
        .catch(error => {
          console.log('Error al registrar el Service Worker:', error);
        });
    });
  }
  