// Configuración de Supabase
const SUPABASE_URL = 'https://ujvcuuodacbtlvdnwafj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqdmN1dW9kYWNidGx2ZG53YWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTQ4MDYsImV4cCI6MjA3MzY5MDgwNn0.voYziriyh2ROHnekjhCnen0R6b3AGKdtNzqCa4llfBk';

// Crear cliente de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Inicializar datos de ejemplo
async function initializeSampleData() {
    try {
        // Productos de ejemplo
        const sampleProducts = [
            {
                nombre: 'Pastel de Chocolate',
                tipo: 'pastel',
                descripcion: 'Delicioso pastel de chocolate con cobertura de ganache',
                precio: 120.00,
                stock: 15,
                imagen: 'https://images.unsplash.com/photo-1644158776192-2d24ce35da1d?w=500'
            },
            {
                nombre: 'Cupcake de Fresa',
                tipo: 'cupcake',
                descripcion: 'Cupcake esponjoso con frosting de fresa natural',
                precio: 15.00,
                stock: 50,
                imagen: 'https://images.unsplash.com/photo-1586985290301-8db40143d525?w=500'
            },
            {
                nombre: 'Macarons Surtidos',
                tipo: 'macaron',
                descripcion: 'Pack de 6 macarons de diferentes sabores',
                precio: 45.00,
                stock: 30,
                imagen: 'https://images.unsplash.com/photo-1702745573186-abd6f7b6443c?w=500'
            },
            {
                nombre: 'Dona Glaseada',
                tipo: 'dona',
                descripcion: 'Dona suave con glaseado de azúcar',
                precio: 12.00,
                stock: 40,
                imagen: 'https://images.unsplash.com/photo-1597419765826-5b03fa018c18?w=500'
            },
            {
                nombre: 'Galletas de Chocolate',
                tipo: 'galleta',
                descripcion: 'Pack de 12 galletas con chispas de chocolate',
                precio: 35.00,
                stock: 25,
                imagen: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500'
            },
            {
                nombre: 'Pastel de Fresa',
                tipo: 'pastel',
                descripcion: 'Pastel de vainilla con fresas frescas y crema',
                precio: 135.00,
                stock: 10,
                imagen: 'https://images.unsplash.com/photo-1667298216085-b0bf5a2e1944?w=500'
            }
        ];

        // Verificar si ya hay productos
        const { data: existingProducts } = await supabase
            .from('producto_t_nuria')
            .select('id')
            .limit(1);

        if (!existingProducts || existingProducts.length === 0) {
            await supabase.from('producto_t_nuria').insert(sampleProducts);
            console.log('Productos de ejemplo insertados');
        }

        // Crear usuario admin
        const { data: existingAdmin } = await supabase
            .from('usuarios_t_nuria')
            .select('id')
            .eq('correo', 'admin@tentaciondenuria.com')
            .single();

        if (!existingAdmin) {
            await supabase.from('usuarios_t_nuria').insert([{
                nombre: 'Admin',
                apellido: 'Sistema',
                telefono: '72793459',
                fecha_nacimiento: '1990-01-01',
                correo: 'admin@tentaciondenuria.com',
                contraseña: 'admin123',
                rol: 'admin',
                auth_id: null
            }]);
            console.log('Usuario admin creado');
        }

        // Crear usuario empleado
        const { data: existingEmployee } = await supabase
            .from('usuarios_t_nuria')
            .select('id')
            .eq('correo', 'empleado@tentaciondenuria.com')
            .single();

        if (!existingEmployee) {
            await supabase.from('usuarios_t_nuria').insert([{
                nombre: 'María',
                apellido: 'García',
                telefono: '71234567',
                fecha_nacimiento: '1995-05-15',
                correo: 'empleado@tentaciondenuria.com',
                contraseña: 'empleado123',
                rol: 'empleado',
                auth_id: null
            }]);
            console.log('Usuario empleado creado');
        }
    } catch (error) {
        console.error('Error inicializando datos:', error);
    }
}

// Ejecutar inicialización
initializeSampleData();
