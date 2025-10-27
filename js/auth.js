// Funciones de autenticación

// Mostrar toast
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Manejar registro
async function handleRegister() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const { data, error } = await supabase
            .from('usuarios_t_nuria')
            .insert([{
                nombre,
                apellido,
                telefono,
                fecha_nacimiento,
                correo: email,
                contraseña: password,
                rol: 'cliente',
                auth_id: null
            }])
            .select()
            .single();

        if (error) throw error;

        const user = {
            id: data.id,
            nombre: data.nombre,
            apellido: data.apellido,
            correo: data.correo,
            rol: data.rol
        };

        localStorage.setItem('user', JSON.stringify(user));
        showToast(`Registro exitoso! Bienvenido ${user.nombre}!`, 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        console.error('Error en registro:', error);
        showToast('Error al registrarse. El email podría estar en uso.', 'error');
    }
}

// Manejar login
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const { data, error } = await supabase
            .from('usuarios_t_nuria')
            .select('*')
            .eq('correo', email)
            .eq('contraseña', password)
            .single();

        if (error || !data) {
            showToast('Credenciales incorrectas', 'error');
            return;
        }

        const user = {
            id: data.id,
            nombre: data.nombre,
            apellido: data.apellido,
            correo: data.correo,
            rol: data.rol
        };

        localStorage.setItem('user', JSON.stringify(user));
        showToast(`Bienvenido ${user.nombre}!`, 'success');

        setTimeout(() => {
            if (user.rol === 'admin') {
                window.location.href = 'panel-admin.html';
            } else if (user.rol === 'empleado') {
                window.location.href = 'panel-empleado.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);
    } catch (error) {
        console.error('Error en login:', error);
        showToast('Error al iniciar sesión', 'error');
    }
}

// Cerrar sesión
function handleSignOut() {
    localStorage.removeItem('user');
    showToast('Sesión cerrada', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Verificar sesión de usuario
function checkUserSession() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        document.getElementById('auth-buttons').style.display = 'flex';
        document.getElementById('user-menu').style.display = 'none';
        return null;
    }

    const user = JSON.parse(userStr);
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-menu').style.display = 'block';
    document.getElementById('user-name').textContent = user.nombre;

    if (user.rol === 'empleado') {
        document.getElementById('employee-panel-btn').style.display = 'block';
    }
    if (user.rol === 'admin') {
        document.getElementById('admin-panel-btn').style.display = 'block';
    }

    return user;
}

// Toggle user dropdown
function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    dropdown.classList.toggle('active');
}

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    mobileNav.classList.toggle('active');
}

// Cerrar dropdown al hacer click fuera
document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('user-menu');
    const dropdown = document.getElementById('user-dropdown');
    
    if (userMenu && dropdown && !userMenu.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});
