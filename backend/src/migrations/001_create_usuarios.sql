-- ==================================================
-- TABLA: usuarios
-- Guarda los datos del emprendedor
-- ==================================================

CREATE TABLE usuarios(
    -- Clave Primaria
    -- PostgreSQL genera el UUID Automaticamente
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Email para login y registro
    email VARCHAR(255) NOT NULL UNIQUE,

    -- contraseña hasheada con bcrypt
    password_hash TEXT NOT NULL,

    -- Nombre del Emprendimiento
    nombre_emprendimiento VARCHAR(255) NOT NULL,

    -- URL del logo almacenado en cloudinary
    logo_url TEXT,

   -- ID de Cloudinary para poder eliminar o actualizar el logo
    logo_public_id TEXT,

    -- Fecha de creación del registro
    created_at TIMESTAMP DEFAULT NOW(),

    -- Fecha de modificación
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Soft Delete
    deleted_at TIMESTAMP
)