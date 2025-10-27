// Funciones para productos

// Cargar productos destacados
async function loadFeaturedProducts() {
    try {
        const { data, error } = await supabase
            .from('producto_t_nuria')
            .select('*')
            .limit(6);

        if (error) throw error;

        const container = document.getElementById('featured-products');
        if (!container) return;

        container.innerHTML = '';

        data.forEach(product => {
            const productCard = createProductCard(product);
            container.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error cargando productos destacados:', error);
    }
}

// Cargar todos los productos
async function loadAllProducts() {
    try {
        const { data, error } = await supabase
            .from('producto_t_nuria')
            .select('*');

        if (error) throw error;

        const container = document.getElementById('catalog-products');
        if (!container) return;

        container.innerHTML = '';

        data.forEach(product => {
            const productCard = createProductCard(product);
            container.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

// Crear tarjeta de producto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.imagen}" alt="${product.nombre}">
        <div class="product-card-content">
            <h3>${product.nombre}</h3>
            <p>${product.descripcion}</p>
            <div class="product-card-footer">
                <span class="product-price">Bs. ${product.precio.toFixed(2)}</span>
                <button class="btn-add-cart" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i>
                    ${product.stock > 0 ? 'Agregar' : 'Sin Stock'}
                </button>
            </div>
        </div>
    `;
    return card;
}

// Agregar al carrito
async function addToCart(productId) {
    try {
        const { data: product, error } = await supabase
            .from('producto_t_nuria')
            .select('*')
            .eq('id', productId)
            .single();

        if (error) throw error;

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.cantidad++;
        } else {
            cart.push({
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                imagen: product.imagen,
                stock: product.stock,
                cantidad: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showToast('Producto agregado al carrito', 'success');
    } catch (error) {
        console.error('Error agregando al carrito:', error);
        showToast('Error al agregar producto', 'error');
    }
}
