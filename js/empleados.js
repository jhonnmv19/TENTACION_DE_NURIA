// Funciones del panel de empleado

// Verificar acceso de empleado
async function checkEmployeeAccess() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || (user.rol !== 'empleado' && user.rol !== 'admin')) {
        showToast('Acceso denegado', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Cargar datos del empleado
async function loadEmployeeData() {
    try {
        // Cargar pedidos
        const { data: pedidos, error: errorPedidos } = await supabase
            .from('pedidos_t_nuria')
            .select('*')
            .order('id', { ascending: false });

        if (errorPedidos) throw errorPedidos;
        renderEmployeeOrders(pedidos || []);

        // Cargar productos
        await loadEmployeeProducts();

    } catch (err) {
        console.error(err);
        showToast('Error al cargar datos', 'error');
    }
}

function renderEmployeeOrders(orders) {
    const container = document.getElementById('employee-orders-list');
    if (!container) return;

    // encabezado tabla
    container.innerHTML = `
        <div class="orders-table-header">
            <div>Pedido</div>
            <div>Cliente / Dirección</div>
            <div>Total</div>
            <div>Estado</div>
            <div>Acciones</div>
        </div>
    `;

    orders.forEach(order => {
        const estado = (order.estado || 'Ingresado');
        const disabledEnviado = (estado === 'Enviado' || estado === 'Entregado') ? 'disabled' : '';
        const disabledEntregado = (estado === 'Entregado') ? 'disabled' : '';
        const fecha = order.fecha ? new Date(order.fecha).toLocaleString() : '';

        container.insertAdjacentHTML('beforeend', `
            <div class="order-row">
                <div>#${order.id}<br><small>${fecha}</small></div>
                <div>${order.nombre || ''} ${order.apellido || ''}<br><small>${order.direccion || ''}</small></div>
                <div>Bs. ${Number(order.total || 0).toFixed(2)}</div>
                <div><span class="status-badge status-${estado.toLowerCase()}">${estado}</span></div>
                <div class="order-actions">
                    <button class="btn-secondary" ${disabledEnviado} onclick="updateOrderStatus(${order.id}, 'Enviado')">Marcar Enviado</button>
                    <button class="btn-primary" ${disabledEntregado} onclick="updateOrderStatus(${order.id}, 'Entregado')">Marcar Entregado</button>
                </div>
            </div>
        `);
    });
}

// Cargar productos
async function loadEmployeeProducts() {
    try {
        const { data, error } = await supabase
            .from('producto_t_nuria')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        const container = document.getElementById('employee-products-list');
        if (!container) return;

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="products-tbody"></tbody>
            </table>
        `;

        const tbody = document.getElementById('products-tbody');
        data.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${product.imagen}" alt="${product.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"></td>
                <td>${product.nombre}</td>
                <td>${product.tipo}</td>
                <td>Bs. ${product.precio.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

// Cargar pedidos
async function loadEmployeeOrders() {
    try {
        const { data, error } = await supabase
            .from('pedidos_t_nuria')
            .select('*')
            .order('fecha', { ascending: false });

        if (error) throw error;

        const container = document.getElementById('employee-orders-list');
        if (!container) return;

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Método de Pago</th>
                        <th>Total</th>
                        <th>Teléfono</th>
                    </tr>
                </thead>
                <tbody id="orders-tbody"></tbody>
            </table>
        `;

        const tbody = document.getElementById('orders-tbody');
        data.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${order.id}</td>
                <td>${order.nombre} ${order.apellido}</td>
                <td>${new Date(order.fecha).toLocaleDateString('es-ES')}</td>
                <td>${order.metodo_pago}</td>
                <td>Bs. ${order.total.toFixed(2)}</td>
                <td>${order.telefono}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error cargando pedidos:', error);
    }
}

// Mostrar/ocultar tabs
function showEmployeeTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`employee-${tab}`).classList.add('active');
}

// Mostrar modal de agregar producto
function showAddProductModal() {
    document.getElementById('add-product-modal').classList.add('active');
}

// Cerrar modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Agregar producto
document.getElementById('add-product-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('product-nombre').value;
    const tipo = document.getElementById('product-tipo').value;
    const descripcion = document.getElementById('product-descripcion').value;
    const precio = parseFloat(document.getElementById('product-precio').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const imagen = document.getElementById('product-imagen').value;

    try {
        const { error } = await supabase
            .from('producto_t_nuria')
            .insert([{ nombre, tipo, descripcion, precio, stock, imagen }]);

        if (error) throw error;

        showToast('Producto agregado exitosamente', 'success');
        closeModal('add-product-modal');
        e.target.reset();
        await loadEmployeeProducts();
    } catch (error) {
        console.error('Error agregando producto:', error);
        showToast('Error al agregar producto', 'error');
    }
});

// Eliminar producto
async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
        const { error } = await supabase
            .from('producto_t_nuria')
            .delete()
            .eq('id', id);

        if (error) throw error;

        showToast('Producto eliminado', 'success');
        await loadEmployeeProducts();
    } catch (error) {
        console.error('Error eliminando producto:', error);
        showToast('Error al eliminar producto', 'error');
    }
}

// Actualizar estado de pedido
async function updateOrderStatus(orderId, nuevoEstado) {
    try {
        const { error } = await supabase
            .from('pedidos_t_nuria')
            .update({ estado: nuevoEstado })
            .eq('id', orderId);

        if (error) throw error;

        showToast(`Pedido marcado como "${nuevoEstado}"`, 'success');
        await loadEmployeeData(); // Recargar datos para actualizar la vista
    } catch (err) {
        console.error('Error actualizando estado:', err);
        showToast('Error al actualizar estado', 'error');
    }
}

// Renderizar pedidos en el panel del empleado
function renderEmployeeOrders(orders) {
    const container = document.getElementById('employee-orders-list');
    if (!container) return;

    // encabezado tabla
    container.innerHTML = `
        <div class="orders-table-header">
            <div>Pedido</div>
            <div>Cliente / Dirección</div>
            <div>Total</div>
            <div>Estado</div>
            <div>Acciones</div>
        </div>
    `;

    orders.forEach(order => {
        const estado = (order.estado || 'Ingresado');
        const disabledEnviado = (estado === 'Enviado' || estado === 'Entregado') ? 'disabled' : '';
        const disabledEntregado = (estado === 'Entregado') ? 'disabled' : '';
        const fecha = order.fecha ? new Date(order.fecha).toLocaleString() : '';

        container.insertAdjacentHTML('beforeend', `
            <div class="order-row">
                <div>#${order.id}<br><small>${fecha}</small></div>
                <div>${order.nombre || ''} ${order.apellido || ''}<br><small>${order.direccion || ''}</small></div>
                <div>Bs. ${Number(order.total || 0).toFixed(2)}</div>
                <div><span class="status-badge status-${estado.toLowerCase()}">${estado}</span></div>
                <div class="order-actions">
                    <button class="btn-secondary" ${disabledEnviado} onclick="updateOrderStatus(${order.id}, 'Enviado')">Marcar Enviado</button>
                    <button class="btn-primary" ${disabledEntregado} onclick="updateOrderStatus(${order.id}, 'Entregado')">Marcar Entregado</button>
                </div>
            </div>
        `);
    });
}

// Cerrar modal al hacer click fuera
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
