-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS restaurante;
USE restaurante;

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    comentario TEXT NOT NULL,
    estrellas INT CHECK (estrellas BETWEEN 1 AND 5),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de menú (platos)
CREATE TABLE IF NOT EXISTS menu (msy
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria ENUM('Entrada', 'Plato Principal', 'Postre', 'Bebida') NOT NULL,
    imagen VARCHAR(255), -- ruta de la imagen
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(100),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    personas INT NOT NULL,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Usuarios 
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'cliente') DEFAULT 'cliente'
);

-- Datos Usuarios Admin

INSERT INTO usuarios (usuario, password, rol) VALUES 
('admin', '1234', 'admin'),
('chef', 'cocinero2024', 'admin'),
('gerente', 'adminmerito', 'admin');


-- 🔹 Datos de prueba para menú
INSERT INTO menu (nombre, descripcion, precio, categoria, imagen) VALUES
('Ceviche Clásico', 'Pesca del día con limón, cebolla morada y ají limo.', 25.00, 'Entrada', '/asset/cevi.png'),
('Seco de Cabrito', 'Cabrito tierno al estilo norteño con frejoles y arroz.', 35.00, 'Plato Principal', '/asset/plato1.png'),
('Suspiro a la Limeña', 'Postre tradicional peruano con manjar blanco y merengue.', 15.00, 'Postre', '/asset/postre1.png'),
('Chicha Morada', 'Bebida refrescante de maíz morado con frutas.', 8.00, 'Bebida', '/asset/chicha.png');

