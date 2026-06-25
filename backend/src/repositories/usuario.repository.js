// Importamos la conexión a PostgreSQL.
// db es el Pool que configuramos en database.js
import pool from "../database/connection.js";

/**
 * ==================================================
 * REPOSITORY: Buscar usuario por ID
 * ==================================================
 *
 * ¿Qué hace?
 * Busca un usuario en la tabla "usuarios"
 * utilizando su ID.
 *
 * ¿Qué recibe?
 * - id: UUID del usuario.
 *
 * ¿Qué devuelve?
 * - Un objeto usuario si existe.
 * - undefined si no existe.
 */
export const findUserByIdRepository = async (id) => {

    /**
     * Consulta SQL.
     *
     * SELECT:
     * Indica qué columnas queremos obtener.
     *
     * FROM usuarios:
     * Tabla donde vamos a buscar.
     *
     * WHERE id = $1:
     * Busca el usuario cuyo id coincida.
     *
     * AND deleted_at IS NULL:
     * Ignora usuarios eliminados lógicamente.
     */
    const query = `
        SELECT
            id,
            email,
            nombre_emprendimiento,
            activo,
            created_at
        FROM usuarios
        WHERE id = $1
        AND deleted_at IS NULL
    `;

    /**
     * Ejecutamos la consulta.
     *
     * db.query() recibe:
     *
     * 1) El SQL.
     * 2) Un array con los parámetros.
     *
     * El $1 del SQL será reemplazado por el id.
     *
     * Ejemplo:
     *
     * id = "123"
     *
     * PostgreSQL ejecutará:
     *
     * SELECT *
     * FROM usuarios
     * WHERE id = '123'
     *
     * Esto evita SQL Injection.
     */
    const result = await pool.query(
        query,
        [id]
    );

    /**
     * PostgreSQL devuelve un objeto.
     *
     * Ejemplo:
     *
     * {
     *   rows: [
     *      {
     *          id: "...",
     *          email: "test@gmail.com"
     *      }
     *   ],
     *   rowCount: 1
     * }
     *
     * rows es un array.
     */

    /**
     * rows[0]
     * devuelve el primer registro encontrado.
     *
     * Si existe:
     *
     * {
     *   id: "...",
     *   email: "..."
     * }
     *
     * Si no existe:
     *
     * undefined
     */
    return result.rows[0];
};

export const findUserByEmailRepository = async (email) => {
    const query = `
        SELECT *
        FROM usuarios
        WHERE email = $1
        AND deleted_at IS NULL
    `;

    const result = await pool.query(query, [email]);

    return result.rows[0];
};

export const createUserRepository = async ({
    email,
    passwordHash,
    nombreEmprendimiento,
    logo_url,
    logo_public_id
}) => {



    const query = `
        INSERT INTO usuarios (
            email,
            password_hash,
            nombre_emprendimiento,
            logo_url,
            logo_public_id
        )
        VALUES ($1, $2, $3)
        RETURNING
            id,
            email,
            nombre_emprendimiento,
            created_at
    `;



    const result = await pool.query(
        query,
        [
            email,
            passwordHash,
            nombreEmprendimiento
        ]
    );

    return result.rows[0];
};