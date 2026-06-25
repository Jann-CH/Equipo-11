-- ==================================================
-- TABLA: PRESUPUESTOS
-- Guarda los presupuestos creados por cada usuario para sus clientes
-- ==================================================

CREATE TABLE presupuesto(
    -- Clave Primaria: Genera un UUID único automáticamente usando la función nativa de Postgres
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Usuario dueño del presupuesto (Clave Foránea hacia la tabla usuarios)
    usuario_id UUID NOT NULL, 

    -- Cliente al que se le emite el presupuesto (Clave Foránea hacia la tabla cliente)
    cliente_id UUID NOT NULL, 

    -- Fecha de emisión o creación del Presupuesto para el negocio
    fecha_creacion TIMESTAMP DEFAULT NOW(),

    -- Subtotal: Suma de los ítems antes de impuestos o descuentos (10 dígitos en total, 2 decimales)
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,

    -- Total: Monto final neto a pagar en el presupuesto
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,

    -- CORRECCIÓN 1: En SQL las cadenas de texto (strings) SIEMPRE van con comillas SIMPLES (''). 
    -- Las comillas dobles ("") se reservan para nombres de tablas o columnas con mayúsculas/espacios.
    estado VARCHAR(100) DEFAULT 'guardado',

    -- URL pública del documento PDF almacenado en Cloudinary
    pdf_url TEXT,

    -- Identificador único de Cloudinary para poder borrar o reemplazar el archivo PDF en el futuro
    pdf_public_id TEXT,

    -- Fecha límite de validez del presupuesto
    fecha_vencimiento TIMESTAMP,

    -- Auditoría: Fecha de inserción del registro en la base de datos
    created_at TIMESTAMP DEFAULT NOW(),

    -- Auditoría: Fecha de la última actualización del registro
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Soft Delete: Fecha de eliminación lógica (si no es NULL, el presupuesto se considera borrado)
    deleted_at TIMESTAMP,

    -- Relación con la tabla usuarios: Si el usuario se elimina, se borran sus presupuestos en cascada
    CONSTRAINT fk_presupuesto_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE, -- CORRECCIÓN 2: Se agregó la COMA obligatoria aquí para separar las restricciones.

    -- Relación con la tabla cliente: Si el cliente se elimina, se borran sus presupuestos en cascada
    CONSTRAINT fk_presupuesto_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id)
        ON DELETE CASCADE
);