// Funciones de pedidos

// Realizar pedido
async function realizarPedido() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const user = JSON.parse(localStorage.getItem('user'));

    if (cart.length === 0) {
        showToast('El carrito está vacío', 'error');
        return;
    }

    const nombre = document.getElementById('checkout-nombre').value;
    const apellido = document.getElementById('checkout-apellido').value;
    const direccion = document.getElementById('checkout-direccion').value;
    const telefono = document.getElementById('checkout-telefono').value;
    const correo = document.getElementById('checkout-correo').value;
    const metodo_pago = document.querySelector('input[name="metodo_pago"]:checked').value;

    const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const impuestos = subtotal * 0.13;
    const total = subtotal + impuestos;

    try {
        // Insertar pedido
        const { data: orderData, error: orderError } = await supabase
            .from('pedidos_t_nuria')
            .insert([{
                usuario_id: user ? user.id : null,
                nombre,
                apellido,
                direccion,
                telefono,
                correo,
                metodo_pago,
                subtotal,
                impuestos,
                total,
                foto_url: null,
                estado: 'Ingresado' // <-- añadir estado inicial
            }])
            .select()
            .single();

        if (orderError) throw orderError;

        // Insertar detalles del pedido
        const detalles = cart.map(item => ({
            pedido_id: orderData.id,
            producto_id: item.id,
            producto: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio
        }));

        const { error: detallesError } = await supabase
            .from('detalle_pedido_t_nuria')
            .insert(detalles);

        if (detallesError) throw detallesError;

        // Actualizar stock
        for (const item of cart) {
            const { data: product } = await supabase
                .from('producto_t_nuria')
                .select('stock')
                .eq('id', item.id)
                .single();

            if (product) {
                await supabase
                    .from('producto_t_nuria')
                    .update({ stock: product.stock - item.cantidad })
                    .eq('id', item.id);
            }
        }

        // Limpiar carrito
        localStorage.removeItem('cart');
        showToast('Pedido realizado exitosamente!', 'success');

        setTimeout(() => {
            window.location.href = 'mis-pedidos.html';
        }, 1500);
    } catch (error) {
        console.error('Error al realizar pedido:', error);
        showToast('Error al procesar el pedido', 'error');
    }
}

// Cargar pedidos del usuario
async function loadUserOrders() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        showToast('Por favor inicia sesión', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    try {
        const { data, error } = await supabase
            .from('pedidos_t_nuria')
            .select('*')
            .eq('usuario_id', user.id)
            .order('fecha', { ascending: false });

        if (error) throw error;

        const container = document.getElementById('orders-list');
        const emptyEl = document.getElementById('orders-empty');

        if (data.length === 0) {
            if (container) container.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';
        if (!container) return;

        container.innerHTML = '';

        data.forEach(order => {
            const estadoClass = `status-${(order.estado || 'Ingresado').toLowerCase()}`; // ej. status-ingresado
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            orderCard.innerHTML = `
                <div class="order-header">
                    <div>
                        <h3>Pedido #${order.id} <span class="status-badge ${estadoClass}">${order.estado || 'Ingresado'}</span></h3>
                        <p>${new Date(order.fecha).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                        <p class="order-total">Bs. ${order.total.toFixed(2)}</p>
                        <p class="order-method">${order.metodo_pago}</p>
                    </div>
                </div>
                <div class="order-details">
                    <p><strong>Dirección:</strong> ${order.direccion}</p>
                    <p><strong>Teléfono:</strong> ${order.telefono}</p>
                </div>
            `;
            container.appendChild(orderCard);
        });
    } catch (error) {
        console.error('Error cargando pedidos:', error);
        showToast('Error al cargar pedidos', 'error');
    }
}

// Actualizar estado de un pedido (empleados/admin)
async function updateOrderStatus(orderId, nuevoEstado) {
    try {
        const { error } = await supabase
            .from('pedidos_t_nuria')
            .update({ estado: nuevoEstado })
            .eq('id', orderId);

        if (error) throw error;
        showToast(`Estado actualizado a "${nuevoEstado}"`, 'success');
        // refrescar lista de pedidos en la página actual si existe la función
        if (typeof loadUserOrders === 'function') await loadUserOrders();
        if (typeof loadEmployeeOrders === 'function') await loadEmployeeOrders(); // si tienes otra función para empleados
    } catch (err) {
        console.error('Error actualizando estado:', err);
        showToast('No se pudo actualizar el estado', 'error');
    }
}
