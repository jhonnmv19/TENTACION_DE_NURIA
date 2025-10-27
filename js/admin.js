// Funciones del panel de admin

// Verificar acceso de admin
async function checkAdminAccess() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || user.rol !== 'admin') {
        showToast('Acceso denegado', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Cargar datos del admin
async function loadAdminData() {
    await loadEmployees();
    await loadSalesReport();
}

// Cargar empleados
async function loadEmployees() {
    try {
        const { data, error } = await supabase
            .from('empleados_t_nuria')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        const container = document.getElementById('admin-employees-list');
        if (!container) return;

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Cargo</th>
                        <th>Edad</th>
                        <th>Email</th>
                        <th>Estado</th>
                        <th>Horario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="employees-tbody"></tbody>
            </table>
        `;

        const tbody = document.getElementById('employees-tbody');
        data.forEach(emp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${emp.nombre}</td>
                <td>${emp.cargo}</td>
                <td>${emp.edad}</td>
                <td>${emp.email}</td>
                <td><span class="status-badge status-${emp.estado}">${emp.estado}</span></td>
                <td>${emp.hora_entrada} - ${emp.hora_salida}</td>
                <td>
                    <button class="btn-delete" onclick="deleteEmployee(${emp.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error cargando empleados:', error);
    }
}

// Cargar reporte de ventas
async function loadSalesReport() {
    try {
        const { data, error } = await supabase
            .from('pedidos_t_nuria')
            .select('*')
            .order('fecha', { ascending: false });

        if (error) throw error;

        const totalSales = data.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = data.length;
        const averageOrder = totalOrders > 0 ? totalSales / totalOrders : 0;

        document.getElementById('total-sales').textContent = `Bs. ${totalSales.toFixed(2)}`;
        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('average-order').textContent = `Bs. ${averageOrder.toFixed(2)}`;

        // Cargar productos más vendidos
        await loadTopProducts();
    } catch (error) {
        console.error('Error cargando reporte:', error);
    }
}

// Cargar productos más vendidos
async function loadTopProducts() {
    try {
        const { data, error } = await supabase
            .from('detalle_pedido_t_nuria')
            .select('*');

        if (error) throw error;

        const productMap = new Map();
        data.forEach(detalle => {
            if (productMap.has(detalle.producto)) {
                const existing = productMap.get(detalle.producto);
                productMap.set(detalle.producto, {
                    nombre: detalle.producto,
                    cantidad: existing.cantidad + detalle.cantidad,
                    total: existing.total + (detalle.precio * detalle.cantidad)
                });
            } else {
                productMap.set(detalle.producto, {
                    nombre: detalle.producto,
                    cantidad: detalle.cantidad,
                    total: detalle.precio * detalle.cantidad
                });
            }
        });

        const topProducts = Array.from(productMap.values())
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);

        const container = document.getElementById('top-products');
        if (!container) return;

        container.innerHTML = '<h4>Productos Más Vendidos</h4>';
        topProducts.forEach((product, index) => {
            const div = document.createElement('div');
            div.className = 'top-product-item';
            div.innerHTML = `
                <span>${index + 1}. ${product.nombre}</span>
                <span>Cantidad: ${product.cantidad} | Total: Bs. ${product.total.toFixed(2)}</span>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error cargando productos más vendidos:', error);
    }
}

// Mostrar/ocultar tabs
function showAdminTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`admin-${tab}`).classList.add('active');
}

// Mostrar modal de agregar empleado
function showAddEmployeeModal() {
    document.getElementById('add-employee-modal').classList.add('active');
}

// Agregar empleado
document.getElementById('add-employee-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('employee-nombre').value;
    const cargo = document.getElementById('employee-cargo').value;
    const edad = parseInt(document.getElementById('employee-edad').value);
    const email = document.getElementById('employee-email').value;
    const contraseña = document.getElementById('employee-password').value;
    const hora_entrada = document.getElementById('employee-entrada').value;
    const hora_salida = document.getElementById('employee-salida').value;

    try {
        const { error } = await supabase
            .from('empleados_t_nuria')
            .insert([{
                nombre,
                cargo,
                edad,
                email,
                contraseña,
                estado: 'activo',
                hora_entrada,
                hora_salida,
                foto_url: null
            }]);

        if (error) throw error;

        showToast('Empleado registrado exitosamente', 'success');
        closeModal('add-employee-modal');
        e.target.reset();
        await loadEmployees();
    } catch (error) {
        console.error('Error registrando empleado:', error);
        showToast('Error al registrar empleado', 'error');
    }
});

// Eliminar empleado
async function deleteEmployee(id) {
    if (!confirm('¿Estás seguro de eliminar este empleado?')) return;

    try {
        const { error } = await supabase
            .from('empleados_t_nuria')
            .delete()
            .eq('id', id);

        if (error) throw error;

        showToast('Empleado eliminado', 'success');
        await loadEmployees();
    } catch (error) {
        console.error('Error eliminando empleado:', error);
        showToast('Error al eliminar empleado', 'error');
    }
}
