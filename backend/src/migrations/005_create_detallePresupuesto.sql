-- ==================================================
-- TABLA: detalle_presupuesto
-- Guarda cada línea de ítem dentro de un presupuesto
-- (relación 1 presupuesto -> N ítems)
-- ==================================================

CREATE TABLE detalle_presupuesto(
    -- Clave Primaria: Genera un UUID único automáticamente usando la función nativa de Postgres
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Ítem cotizado en esta línea (Clave Foránea hacia la tabla item)
    items_id UUID NOT NULL,

    -- Presupuesto al que pertenece esta línea (Clave Foránea hacia la tabla presupuesto)
    presupuesto_id UUID NOT NULL,

    -- Cantidad cotizada de este ítem
    cantidad INTEGER NOT NULL DEFAULT 0,

    -- Precio unitario al momento de cotizar (se copia acá para no depender de que 'item.precio' no cambie después)
    precio_unitario NUMERIC(10, 2) NOT NULL DEFAULT 0.00,

    -- Subtotal de la línea: cantidad * precio_unitario
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,

    -- Auditoría: Fecha de inserción del registro en la base de datos
    created_at TIMESTAMP DEFAULT NOW(),

    -- Auditoría: Fecha de la última actualización del registro
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Soft Delete: Fecha de eliminación lógica
    deleted_at TIMESTAMP,

    -- Relación con la tabla presupuesto: Si el presupuesto se elimina, se borran sus líneas en cascada
    CONSTRAINT fk_detalle_presupuesto_presupuesto
        FOREIGN KEY (presupuesto_id) REFERENCES presupuesto(id) ON DELETE CASCADE,

    -- Relación con la tabla item: Si el ítem se elimina, la línea queda sin referencia (no se borra el historial)
    CONSTRAINT fk_detalle_presupuesto_item
        FOREIGN KEY (items_id) REFERENCES item(id) ON DELETE SET NULL
);