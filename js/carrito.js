// Funciones del carrito

// Actualizar contador del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.cantidad, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = count;
    }
}

// Mostrar carrito
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items');
    const emptyEl = document.getElementById('cart-empty');
    const summaryEl = document.getElementById('cart-summary');

    if (cart.length === 0) {
        if (container) container.innerHTML = '';
        if (emptyEl) emptyEl.style.display = 'block';
        if (summaryEl) summaryEl.style.display = 'none';
        return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (summaryEl) summaryEl.style.display = 'block';
    
    if (!container) return;
    
    container.innerHTML = '';

       cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="cart-item-details">
                <h4><i class="fas fa-shopping-cart cart-item-icon" aria-hidden="true"></i> ${item.nombre}</h4>
                <p class="cart-item-price">Bs. ${item.precio.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.cantidad}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        container.appendChild(cartItem);
    });

    updateCartSummary();
}

// Actualizar cantidad
function updateQuantity(productId, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        item.cantidad += delta;
        if (item.cantidad <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// Eliminar del carrito
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
    showToast('Producto eliminado del carrito', 'success');
}

// Actualizar resumen
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const tax = subtotal * 0.13;
    const total = subtotal + tax;

    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `Bs. ${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `Bs. ${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `Bs. ${total.toFixed(2)}`;
}

// Proceder al checkout
function proceedToCheckout() {
    const user = localStorage.getItem('user');
    if (!user) {
        showToast('Por favor inicia sesión para continuar', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    window.location.href = 'checkout.html';
}

// Cargar datos del checkout
function loadCheckoutData() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const user = JSON.parse(localStorage.getItem('user'));

    if (cart.length === 0) {
        showToast('Tu carrito está vacío', 'info');
        setTimeout(() => {
            window.location.href = 'catalogo.html';
        }, 1500);
        return;
    }

    if (user) {
        document.getElementById('checkout-nombre').value = user.nombre || '';
        document.getElementById('checkout-apellido').value = user.apellido || '';
        document.getElementById('checkout-correo').value = user.correo || '';
    }

    const container = document.getElementById('checkout-items');
    if (container) {
        container.innerHTML = '';
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'checkout-item';
            div.innerHTML = `
                <span>${item.nombre} x${item.cantidad}</span>
                <span>Bs. ${(item.precio * item.cantidad).toFixed(2)}</span>
            `;
            container.appendChild(div);
        });
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const tax = subtotal * 0.13;
    const total = subtotal + tax;

    document.getElementById('checkout-subtotal').textContent = `Bs. ${subtotal.toFixed(2)}`;
    document.getElementById('checkout-tax').textContent = `Bs. ${tax.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `Bs. ${total.toFixed(2)}`;
}
