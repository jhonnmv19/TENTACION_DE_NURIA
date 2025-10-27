# Sistema ERP - Tentación de Nuria
## Versión HTML, CSS y JavaScript Vanilla

### 📁 Estructura del Proyecto

```
proyecto/
├── html/                        # Archivos HTML
│   ├── index.html              # Página principal
│   ├── registro.html           # Registro de usuarios
│   ├── login.html              # Inicio de sesión
│   ├── catalogo.html           # Catálogo de productos
│   ├── contacto.html           # Página de contacto
│   ├── sobre-nosotros.html     # Acerca de
│   ├── carrito.html            # Carrito de compras
│   ├── checkout.html           # Finalizar pedido
│   ├── mis-pedidos.html        # Pedidos del usuario
│   ├── panel-empleado.html     # Panel de empleado
│   └── panel-admin.html        # Panel de administrador
├── js/                         # Archivos JavaScript
│   ├── supabase-config.js      # Configuración de Supabase
│   ├── auth.js                 # Autenticación
│   ├── productos.js            # Gestión de productos
│   ├── carrito.js              # Carrito de compras
│   ├── pedidos.js              # Gestión de pedidos
│   ├── empleados.js            # Panel de empleado
│   ├── admin.js                # Panel de administrador
│   └── pdf-generator.js        # Generación de PDFs
└── styles/                     # Archivos CSS
    └── vanilla-styles.css      # Estilos completos
```

### 🚀 Cómo Usar

#### 1. **Configuración Inicial**

Los archivos ya están configurados con tu conexión a Supabase:
- URL: `https://ujvcuuodacbtlvdnwafj.supabase.co`
- Key: Ya incluida en `js/supabase-config.js`

#### 2. **Abrir en Visual Studio Code**

1. Abre Visual Studio Code
2. Abre la carpeta del proyecto
3. Instala la extensión "Live Server" si no la tienes
4. Click derecho en `html/index.html` → "Open with Live Server"

#### 3. **Cuentas de Prueba**

El sistema crea automáticamente estas cuentas:

**Administrador:**
- Email: `admin@tentaciondenuria.com`
- Contraseña: `admin123`
- Acceso: Panel de Admin + Panel de Empleado

**Empleado:**
- Email: `empleado@tentaciondenuria.com`
- Contraseña: `empleado123`
- Acceso: Panel de Empleado

**Cliente:**
- Regístrate desde la página de registro
- Acceso: Catálogo y pedidos

#### 4. **Productos de Ejemplo**

El sistema carga automáticamente 6 productos de ejemplo:
- Pastel de Chocolate
- Cupcake de Fresa
- Macarons Surtidos
- Dona Glaseada
- Galletas de Chocolate
- Pastel de Fresa

### 📋 Funcionalidades

#### **Para Clientes:**
- ✅ Ver catálogo de productos
- ✅ Agregar productos al carrito
- ✅ Realizar pedidos
- ✅ Ver historial de pedidos
- ✅ Múltiples métodos de pago (Tarjeta, Efectivo, Transferencia, QR)

#### **Para Empleados:**
- ✅ Gestión de productos (Agregar/Eliminar)
- ✅ Ver todos los pedidos
- ✅ Control de inventario

#### **Para Administradores:**
- ✅ Gestión de empleados (Agregar/Eliminar)
- ✅ Reportes de ventas con estadísticas
- ✅ **Descarga de reportes en PDF** 📄
- ✅ Ver productos más vendidos
- ✅ Análisis de ventas por período (Semana/Mes/Año)

### 📊 Base de Datos

El sistema usa las siguientes tablas en Supabase:

1. **usuarios_t_nuria** - Usuarios del sistema
2. **producto_t_nuria** - Productos
3. **pedidos_t_nuria** - Pedidos realizados
4. **detalle_pedido_t_nuria** - Detalles de cada pedido
5. **empleados_t_nuria** - Empleados de la empresa

### 🎨 Personalización

#### **Cambiar Colores:**
Edita las variables en `styles/vanilla-styles.css`:

```css
:root {
    --color-primary: #bc6071;      /* Rosa principal */
    --color-secondary: #e49dab;    /* Rosa claro */
    --color-tertiary: #cca0a8;     /* Rosa terciario */
    --color-hover: #a4202e;        /* Rojo hover */
    --color-bg: #fefae2;           /* Fondo crema */
}
```

#### **Agregar tu Logo:**
Reemplaza el emoji 🧁 en los archivos HTML:

```html
<!-- Busca esto en cada archivo HTML: -->
<h1 class="logo-text">🧁 Tentación de Nuria</h1>

<!-- Reemplaza con: -->
<img src="../imagenes/logo.png" alt="Logo" class="logo">
```

### 🔧 Dependencias Externas

El sistema usa estos CDNs (ya incluidos en los HTML):

1. **Supabase Client** - Para la base de datos
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   ```

2. **Font Awesome** - Para los iconos
   ```html
   <script src="https://kit.fontawesome.com/a076d05399.js"></script>
   ```

3. **jsPDF** - Para generar PDFs (solo en panel-admin.html)
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>
   ```

### 📝 Notas Importantes

1. **Seguridad:** Las contraseñas se almacenan en texto plano. Para producción, debes implementar hash de contraseñas.

2. **Inicialización:** Al abrir `index.html`, el sistema crea automáticamente:
   - Productos de ejemplo
   - Usuario admin
   - Usuario empleado

3. **Navegación:** Todos los enlaces internos funcionan correctamente entre páginas.

4. **Responsive:** El diseño es completamente responsive y funciona en móviles, tablets y desktop.

5. **PDF:** Los reportes PDF incluyen:
   - Resumen de ventas
   - Productos más vendidos
   - Detalle de pedidos
   - Logo y branding de la empresa

### 🐛 Solución de Problemas

**Error: "Cannot read properties of null"**
- Verifica que todos los archivos JS estén en la carpeta `js/`
- Asegúrate de que los scripts se carguen en el orden correcto

**Error: "Supabase is not defined"**
- Verifica tu conexión a internet
- El CDN de Supabase debe cargar antes que tus scripts

**No se muestran los productos:**
- Verifica la conexión a Supabase
- Revisa la consola del navegador (F12) para ver errores
- Asegúrate de que las tablas existen en Supabase

### 📞 Soporte

Para cualquier duda:
- Email: info@tentaciondenuria.com
- Facebook: https://www.facebook.com/jhonalan.veizaga
- Instagram: https://www.instagram.com/elitemotor.2000/

---

**Desarrollado para Tentación de Nuria** 🧁
© 2025 Todos los derechos reservados
