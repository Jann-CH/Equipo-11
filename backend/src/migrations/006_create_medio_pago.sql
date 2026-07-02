-- ==================================================
-- TABLA: pagos
-- Registra el cobro efectivo de un presupuesto (botón "Pagar")
-- Es independiente de presupuesto.medio_pago_id, que es solo
-- la condición de pago PROPUESTA al cliente al momento de cotizar.
-- ==================================================

CREATE TABLE pagos (
    -- Clave Primaria
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Presupuesto que se está cobrando
    presupuesto_id UUID NOT NULL,

    -- Medio de pago usado realmente al cobrar (puede diferir del propuesto en el presupuesto)
    medio_pago_id UUID REFERENCES medios_pago(id),

    -- Monto total cobrado (incluye recargo si lo hubo)
    monto_total NUMERIC(10, 2) NOT NULL,

    -- Campos específicos de tarjeta (o valores por defecto para otros medios)
    cuotas INT DEFAULT 1,
    recargo_monto NUMERIC(10, 2) DEFAULT 0.00,

    -- Ej: el ID de operación de la terminal o de MercadoPago
    referencia_transaccion VARCHAR(100),

    -- Estado del pago en sí (puede fallar o quedar pendiente, a diferencia del estado del presupuesto)
    estado VARCHAR(50) DEFAULT 'Pendiente'
        CHECK (estado IN ('Pendiente', 'Aprobado', 'Rechazado')),

    -- Fecha en que se acreditó/confirmó el pago (puede ser distinta a created_at si queda pendiente)
    fecha_pago TIMESTAMP,

    -- Auditoría
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,

    -- Relación con presupuesto: si se elimina el presupuesto, se borran sus pagos en cascada
    CONSTRAINT fk_pago_presupuesto
        FOREIGN KEY (presupuesto_id)
        REFERENCES presupuesto(id)
        ON DELETE CASCADE
);