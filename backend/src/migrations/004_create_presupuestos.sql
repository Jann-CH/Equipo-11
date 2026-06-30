-- ==================================================
-- TABLA: Presupuestos
-- Cabecera del presupuesto asignado a un cliente
-- ==================================================

CREATE TABLE presupuestos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL,
    cliente_id UUID NOT NULL,
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE,
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    -- CHECK constraint: el motor de BD rechaza cualquier valor no autorizado
    -- Esta es la última línea de defensa, independiente del backend
    estado VARCHAR(50) DEFAULT 'Borrador'
        CHECK (estado IN ('Borrador', 'Guardado', 'Enviado', 'Aceptado', 'Rechazado')),
    pdf_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,

    CONSTRAINT fk_presupuesto_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,
        
    CONSTRAINT fk_presupuesto_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
        ON DELETE CASCADE
);