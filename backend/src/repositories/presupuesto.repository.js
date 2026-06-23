import pool from "../database/connection.js";

export const findPresupuestoConDetallesRepository = async (presupuestoId, usuarioId) => {
    const queryPresupuesto = `
        SELECT p.*, c.nombre as cliente_nombre, c.apellido as cliente_apellido
        FROM presupuestos p
        JOIN clientes c ON p.cliente_id = c.id
        WHERE p.id = $1 AND p.usuario_id = $2 AND p.deleted_at IS NULL;
    `;
    
    const queryDetalles = `
        SELECT dp.*, i.nombre as item_nombre
        FROM detalle_presupuesto dp
        JOIN items i ON dp.item_id = i.id
        WHERE dp.presupuesto_id = $1;
    `;

    const presupuestoRes = await pool.query(queryPresupuesto, [presupuestoId, usuarioId]);
    if (presupuestoRes.rows.length === 0) return null;

    const detallesRes = await pool.query(queryDetalles, [presupuestoId]);

    return {
        ...presupuestoRes.rows[0],
        detalles: detallesRes.rows
    };
};