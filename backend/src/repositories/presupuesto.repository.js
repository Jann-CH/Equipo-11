import pool from "../database/connection.js";

/**
 * ==================================================
 * REPOSITORY: Obtener presupuesto con detalles
 * ==================================================
**/
export const findPresupuestoConDetallesRepository = async (presupuestoId, usuarioId) => {
    const query = `
        SELECT
            p.id,
            p.fecha_creacion,
            p.fecha_vencimiento,
            p.subtotal,
            p.total,
            p.estado,
            p.pdf_url,
            p.created_at,
            c.nombre  AS cliente_nombre,
            c.apellido AS cliente_apellido,
            c.email   AS cliente_email,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id',              dp.id,
                    'item_id',         dp.item_id,
                    'item_nombre',     i.nombre,
                    'cantidad',        dp.cantidad,
                    'precio_unitario', dp.precio_unitario,
                    'subtotal',        dp.subtotal
                ) ORDER BY dp.created_at
            ) AS detalles
        FROM presupuestos p
        JOIN clientes c             ON p.cliente_id  = c.id
        JOIN detalle_presupuesto dp ON dp.presupuesto_id = p.id
        JOIN items i                ON dp.item_id    = i.id
        WHERE p.id = $1
          AND p.usuario_id = $2
          AND p.deleted_at IS NULL
        GROUP BY p.id, c.nombre, c.apellido, c.email;
    `;

    const result = await pool.query(query, [presupuestoId, usuarioId]);
    return result.rows[0] || null;
};

/**
 * ==================================================
 * REPOSITORY: Crear presupuesto con transacción ACID
 * ==================================================
 **/
export const createPresupuestoTransaccionRepository = async ({
    usuarioId,
    clienteId,
    fechaVencimiento,
    subtotalCalculado,
    totalCalculado,
    estado,
    pdfUrl,
    detallesProcesados,
}) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // 1. Insertar cabecera del presupuesto
        const { rows: [nuevoPresupuesto] } = await client.query(
            `INSERT INTO presupuestos
                (usuario_id, cliente_id, fecha_vencimiento, subtotal, total, estado, pdf_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, fecha_creacion, subtotal, total, estado, pdf_url;`,
            [usuarioId, clienteId, fechaVencimiento, subtotalCalculado, totalCalculado, estado, pdfUrl]
        );

        // 2. Insertar cada ítem del detalle
        for (const det of detallesProcesados) {
            await client.query(
                `INSERT INTO detalle_presupuesto
                    (presupuesto_id, item_id, cantidad, precio_unitario, subtotal)
                 VALUES ($1, $2, $3, $4, $5);`,
                [nuevoPresupuesto.id, det.item_id, det.cantidad, det.precio_unitario, det.subtotal]
            );
        }

        await client.query("COMMIT");
        return { ...nuevoPresupuesto, detalles: detallesProcesados };

    } catch (error) {
        await client.query("ROLLBACK");
        // Re-lanzar el error original para que el servicio lo maneje con AppError
        throw error;
    } finally {
        // SIEMPRE liberar la conexión al pool
        client.release();
    }
};