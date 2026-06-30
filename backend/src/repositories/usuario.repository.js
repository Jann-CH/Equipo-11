import pool from "../database/connection.js";

/**
 * ==================================================
 * REPOSITORY: Buscar usuario por ID
 * ==================================================
 **/
export const findUserByIdRepository = async (id) => {

    const query = `
        SELECT
            id,
            email,
            nombre_emprendimiento,
            created_at
        FROM usuarios
        WHERE id = $1
        AND deleted_at IS NULL
    `;

    const result = await pool.query(
        query,
        [id]
    );

    return result.rows[0];
};

export const findUserByEmailRepository = async (email) => {
    const query = `
        SELECT
            id,
            email,
            password_hash,
            nombre_emprendimiento,
            logo_url,
            created_at
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
    nombreEmprendimiento
}) => {

    const query = `
        INSERT INTO usuarios (
            email,
            password_hash,
            nombre_emprendimiento
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