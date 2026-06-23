-- ==================================================
-- TABLA: detalle_presupuesto
-- Relación de muchos a muchos: Items dentro de un presupuesto
-- ==================================================

CREATE TABLE detalle_presupuesto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    presupuesto_id UUID NOT NULL,
    item_id UUID NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_detalle_presupuesto
        FOREIGN KEY (presupuesto_id)
        REFERENCES presupuestos(id)
        ON DELETE CASCADE,
        
    CONSTRAINT fk_detalle_item
        FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE RESTRICT
);