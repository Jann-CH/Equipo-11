import pool from "../database/connection.js";

export const createItemRepository = async ({ usuarioId, nombre, descripcion, precio }) => {
    const query = `
        INSERT INTO items (usuario_id, nombre, descripcion, precio)
        VALUES ($1, $2, $3, $4)
        RETURNING id, usuario_id, nombre, descripcion, precio, activo;
    `;
    const result = await pool.query(query, [usuarioId, nombre, descripcion, precio]);
    return result.rows[0];
};

export const findItemsByUsuarioRepository = async (usuarioId) => {
    const query = `
        SELECT id, nombre, descripcion, precio, activo
        FROM items
        WHERE usuario_id = $1 AND deleted_at IS NULL
        ORDER BY nombre ASC;
    `;
    const result = await pool.query(query, [usuarioId]);
    return result.rows;
};