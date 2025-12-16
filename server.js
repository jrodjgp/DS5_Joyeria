const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Configurar CORS para permitir todas las solicitudes
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SERVIR ARCHIVOS ESTÁTICOS CORRECTAMENTE
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'esther_accessories',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const JWT_SECRET = process.env.JWT_SECRET || 'esther_secret';

// Middleware de autenticación
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                error: 'Token de acceso requerido' 
            });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Verificar usuario en BD
        const [users] = await pool.execute(
            'SELECT id, nombre, email, rol FROM usuarios WHERE id = ?',
            [decoded.id]
        );
        
        if (users.length === 0) {
            return res.status(403).json({ 
                success: false, 
                error: 'Usuario no encontrado' 
            });
        }
        
        req.user = users[0];
        next();
    } catch (error) {
        return res.status(403).json({ 
            success: false, 
            error: 'Token inválido o expirado' 
        });
    }
};

// ==================== RUTAS DE LA API ====================

// 1. REGISTRO DE USUARIO
app.post('/api/register', async (req, res) => {
    try {
        console.log('Registro recibido:', req.body);
        const { nombre, email, password } = req.body;
        
        if (!nombre || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Todos los campos son obligatorios' 
            });
        }
        
        // Verificar si el email ya existe
        const [existing] = await pool.execute(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'El email ya está registrado' 
            });
        }
        
        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insertar usuario
        const [result] = await pool.execute(
            'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
            [nombre, email, hashedPassword]
        );
        
        // Generar token JWT
        const token = jwt.sign(
            { 
                id: result.insertId, 
                email, 
                nombre,
                rol: 'cliente'
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({ 
            success: true,
            token, 
            user: { 
                id: result.insertId, 
                nombre, 
                email,
                rol: 'cliente'
            } 
        });
        
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error en el servidor' 
        });
    }
});

// 2. LOGIN DE USUARIO
app.post('/api/login', async (req, res) => {
    try {
        console.log('Login recibido:', req.body);
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email y contraseña son requeridos' 
            });
        }
        
        // Buscar usuario
        const [users] = await pool.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                error: 'Credenciales incorrectas' 
            });
        }
        
        const user = users[0];
        
        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ 
                success: false, 
                error: 'Credenciales incorrectas' 
            });
        }
        
        // Generar token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                nombre: user.nombre,
                rol: user.rol
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error en el servidor' 
        });
    }
});

// 3. VERIFICAR TOKEN (para mantener sesión)
app.get('/api/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// 4. OBTENER TODOS LOS PRODUCTOS
app.get('/api/productos', async (req, res) => {
    try {
        const { categoria, destacado } = req.query;
        
        let query = 'SELECT * FROM productos WHERE 1=1';
        const params = [];
        
        if (categoria && categoria !== 'all') {
            query += ' AND categoria = ?';
            params.push(categoria);
        }
        
        if (destacado === 'true') {
            query += ' AND destacado = TRUE';
        }
        
        query += ' ORDER BY destacado DESC, created_at DESC';
        
        const [productos] = await pool.execute(query, params);
        
        res.json({ 
            success: true, 
            productos 
        });
        
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al cargar productos' 
        });
    }
});

// 5. BUSCAR PRODUCTOS
app.get('/api/buscar', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.json({ success: true, productos: [] });
        }
        
        const searchTerm = `%${q}%`;
        const [productos] = await pool.execute(
            `SELECT * FROM productos 
             WHERE nombre LIKE ? 
             OR descripcion LIKE ? 
             OR materiales LIKE ?`,
            [searchTerm, searchTerm, searchTerm]
        );
        
        res.json({ success: true, productos });
        
    } catch (error) {
        console.error('Error buscando productos:', error);
        res.status(500).json({ success: false, error: 'Error en la búsqueda' });
    }
});

// 6. OBTENER PRODUCTO POR ID
app.get('/api/productos/:id', async (req, res) => {
    try {
        const [productos] = await pool.execute(
            'SELECT * FROM productos WHERE id = ?',
            [req.params.id]
        );
        
        if (productos.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Producto no encontrado' 
            });
        }
        
        res.json({ 
            success: true, 
            producto: productos[0] 
        });
        
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al cargar producto' 
        });
    }
});

// 7. OBTENER CARRITO DEL USUARIO
app.get('/api/carrito', authenticateToken, async (req, res) => {
    try {
        const [items] = await pool.execute(
            `SELECT c.*, p.nombre, p.precio, p.imagen_url 
             FROM carritos c 
             JOIN productos p ON c.producto_id = p.id 
             WHERE c.usuario_id = ?`,
            [req.user.id]
        );
        
        res.json({ 
            success: true, 
            items 
        });
        
    } catch (error) {
        console.error('Error obteniendo carrito:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al cargar carrito' 
        });
    }
});

// 8. AGREGAR AL CARRITO
app.post('/api/carrito', authenticateToken, async (req, res) => {
    try {
        const { producto_id, cantidad = 1 } = req.body;
        
        if (!producto_id) {
            return res.status(400).json({ 
                success: false, 
                error: 'ID de producto requerido' 
            });
        }
        
        // Verificar si el producto existe
        const [productos] = await pool.execute(
            'SELECT id FROM productos WHERE id = ?',
            [producto_id]
        );
        
        if (productos.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Producto no encontrado' 
            });
        }
        
        // Verificar si ya está en el carrito
        const [existing] = await pool.execute(
            'SELECT * FROM carritos WHERE usuario_id = ? AND producto_id = ?',
            [req.user.id, producto_id]
        );
        
        if (existing.length > 0) {
            // Actualizar cantidad
            await pool.execute(
                'UPDATE carritos SET cantidad = cantidad + ? WHERE id = ?',
                [cantidad, existing[0].id]
            );
        } else {
            // Insertar nuevo
            await pool.execute(
                `INSERT INTO carritos (usuario_id, producto_id, cantidad) 
                 VALUES (?, ?, ?)`,
                [req.user.id, producto_id, cantidad]
            );
        }
        
        res.json({ 
            success: true, 
            message: 'Producto agregado al carrito' 
        });
        
    } catch (error) {
        console.error('Error agregando al carrito:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al agregar al carrito' 
        });
    }
});

// 9. ELIMINAR DEL CARRITO
app.delete('/api/carrito/:id', authenticateToken, async (req, res) => {
    try {
        await pool.execute(
            'DELETE FROM carritos WHERE id = ? AND usuario_id = ?',
            [req.params.id, req.user.id]
        );
        
        res.json({ 
            success: true, 
            message: 'Producto eliminado del carrito' 
        });
        
    } catch (error) {
        console.error('Error eliminando del carrito:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al eliminar del carrito' 
        });
    }
});

// 10. ACTUALIZAR CANTIDAD EN CARRITO
app.put('/api/carrito/:id', authenticateToken, async (req, res) => {
    try {
        const { cantidad } = req.body;
        
        if (cantidad < 1) {
            return res.status(400).json({ 
                success: false, 
                error: 'La cantidad debe ser al menos 1' 
            });
        }
        
        await pool.execute(
            'UPDATE carritos SET cantidad = ? WHERE id = ? AND usuario_id = ?',
            [cantidad, req.params.id, req.user.id]
        );
        
        res.json({ 
            success: true, 
            message: 'Carrito actualizado' 
        });
        
    } catch (error) {
        console.error('Error actualizando carrito:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al actualizar carrito' 
        });
    }
});

// 11. CREAR PEDIDO
app.post('/api/pedidos', authenticateToken, async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Obtener items del carrito
        const [carrito] = await connection.execute(
            `SELECT c.*, p.precio 
             FROM carritos c 
             JOIN productos p ON c.producto_id = p.id 
             WHERE c.usuario_id = ?`,
            [req.user.id]
        );
        
        if (carrito.length === 0) {
            await connection.rollback();
            return res.status(400).json({ 
                success: false, 
                error: 'El carrito está vacío' 
            });
        }
        
        // Calcular total
        const total = carrito.reduce((sum, item) => 
            sum + (item.precio * item.cantidad), 0
        );
        
        // Crear pedido
        const [pedidoResult] = await connection.execute(
            'INSERT INTO pedidos (usuario_id, total, estado) VALUES (?, ?, ?)',
            [req.user.id, total, 'pendiente']
        );
        
        // Limpiar carrito
        await connection.execute(
            'DELETE FROM carritos WHERE usuario_id = ?',
            [req.user.id]
        );
        
        await connection.commit();
        
        res.json({ 
            success: true, 
            message: '¡Pedido creado exitosamente!', 
            pedidoId: pedidoResult.insertId,
            total: total.toFixed(2)
        });
        
    } catch (error) {
        await connection.rollback();
        console.error('Error creando pedido:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al crear el pedido' 
        });
    } finally {
        connection.release();
    }
});

// 12. RUTA PARA OBTENER PERFIL
app.get('/api/perfil', authenticateToken, async (req, res) => {
    try {
        const [usuarios] = await pool.execute(
            'SELECT id, nombre, email, telefono, direccion FROM usuarios WHERE id = ?',
            [req.user.id]
        );
        
        const [pedidos] = await pool.execute(
            'SELECT id, total, estado, fecha_pedido FROM pedidos WHERE usuario_id = ? ORDER BY fecha_pedido DESC',
            [req.user.id]
        );
        
        res.json({
            success: true,
            usuario: usuarios[0],
            pedidos
        });
        
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al cargar perfil' 
        });
    }
});

// 13. RUTA PARA INDEX.HTML (SPA - Single Page Application)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==================== INICIAR SERVIDOR ====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('══════════════════════════════════════════════════');
    console.log(`✨  Servidor Esther Accessories iniciado ✨`);
    console.log(`📍  URL: http://localhost:${PORT}`);
    console.log(`📦  API: http://localhost:${PORT}/api/`);
    console.log('══════════════════════════════════════════════════');
    console.log('📋  Credenciales de prueba:');
    console.log('   👑 Admin: admin@esther.com / admin123');
    console.log('══════════════════════════════════════════════════');
});