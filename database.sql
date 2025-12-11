CREATE DATABASE IF NOT EXISTS esther_accessories;
USE esther_accessories;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    rol ENUM('cliente', 'admin') DEFAULT 'cliente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(500),
    materiales VARCHAR(200),
    stock INT DEFAULT 10,
    destacado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de carritos
CREATE TABLE carritos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT DEFAULT 1,
    material_elegido VARCHAR(50),
    tamaño VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Tabla de pedidos
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente', 'procesando', 'enviado', 'entregado') DEFAULT 'pendiente',
    direccion_envio TEXT,
    metodo_pago VARCHAR(50),
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Insertar datos de ejemplo
INSERT INTO productos (nombre, categoria, precio, descripcion, imagen_url, materiales, destacado) VALUES
('Collar "Luna Dorada"', 'collares', 285.00, 'Collar en oro 18k con detalle de cuarzo rosa.', '/images/collar-luna.jpg', 'oro,cuarzo', TRUE),
('Pulsera "Marea"', 'pulseras', 180.00, 'Pulsera ajustable de cuero italiano con broche en plata.', '/images/pulsera-marea.jpg', 'plata,cuero', TRUE),
('Anillo "Eternidad"', 'anillos', 450.00, 'Anillo de platino con diamantes talla brillante.', '/images/anillo-eternidad.jpg', 'platino,diamante', TRUE),
('Aretes "Estrella"', 'aretes', 320.00, 'Aretes colgantes con zafiros azules.', '/images/aretes-estrella.jpg', 'oro,zafiro', TRUE),
('Collar "Amanecer"', 'collares', 520.00, 'Collar con perla cultivada y esmeraldas.', '/images/collar-amanecer.jpg', 'oro,perla,esmeralda', FALSE);