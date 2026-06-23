import pool from "../database/connection.js";

export const createClienteRepository = async ({ usuarioId, nombre, apellido, email, cuit, telefono }) => {
    const query = `
        INSERT INTO clientes (usuario_id, nombre, apellido, email, cuit, telefono)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, usuario_id, nombre, apellido, email, cuit, telefono, created_at;
    `;
    const result = await pool.query(query, [usuarioId, nombre, apellido, email, cuit, telefono]);
    return result.rows[0];
};

export const findClientesByUsuarioRepository = async (usuarioId) => {
    const query = `
        SELECT id, nombre, apellido, email, cuit, telefono, created_at
        FROM clientes
        WHERE usuario_id = $1 AND deleted_at IS NULL
        ORDER BY nombre ASC;
    `;
    const result = await pool.query(query, [usuarioId]);
    return result.rows;
};