// Importamos la conexión a PostgreSQL.
// db es el Pool que configuramos en database.js
import pool from "../database/connection.js";

export const findItemsByUsuarioRepository = async (usuarioId) => {
    const query = `
        SELECT id, nombre, precio, cantidad, activo
        FROM items
        WHERE usuario_id = $1 AND deleted_at IS NULL
        ORDER BY nombre ASC;
    `;
    const result = await pool.query(query, [usuarioId]);
    return result.rows;
};


export const createItemRepository = async (itemData) => {

    const { 
        usuario_Id, 
        nombre, 
        precio, 
        cantidad 
    } = itemData;

    const query = `
        INSERT INTO items (usuario_id, nombre, precio, cantidad)
        VALUES ($1, $2, $3, $4)
        RETURNING id, usuario_id, nombre, precio, cantidad, activo, created_at;
    `;
    const result = await pool.query(query, [
        usuario_Id, 
        nombre,  
        precio,
        cantidad
    ]);
    return result.rows[0];
};

export const updateItemRepository = async (itemId, updateData) => {
    const { 
        nombre,
        precio, 
        cantidad, 
        activo 
    } = updateData;

    const query = `
        UPDATE items
        SET nombre = $1,
            precio = $2,
            cantidad = $3,         
            activo = $4
            updated_at = NOW()
        WHERE id = $6 AND deleted_at IS NULL
        RETURNING id, usuario_id, nombre, precio, cantidad, activo, created_at;
    `;
    const result = await pool.query(query, [
        nombre,
        precio,
        cantidad,
        activo,
        itemId
    ]);
    return result.rows[0];
};
